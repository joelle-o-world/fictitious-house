const EventEmitter = require('events')
const {GameIO} = require('english-io').html
const {
  FactListener,
  WanderingDescriber,
  DescriptionContext,
  sentencify,
  parseImperative,
  randomSentence,
  sub,
  parse,
} = require('english-io')
const MobileEar = require('../src/sound/MobileEar')


/**
    @class ExplorerGame
    @extends EventEmitter
    @constructor
    @param {Entity} protagonist
*/
class ExplorerGame extends EventEmitter {
  constructor({
    protagonist, dictionary, audioDestination,
    useTickyText, useResponsiveVoice
  }) {
    if(!protagonist || !protagonist.isEntity)
      throw 'ExplorerGame constructor expects a Entity protagonist as argument'

    super()

    // the function to be used in the `move` event listener on the protagonist
    this.onProtagonistMove = (...args) => this.emit('protagonistMove', ...args)

    // create predicateSet, IO, changeListener and wandering describer
    this.io = new GameIO({
      useTickyText: useTickyText,
      useResponsiveVoice: useResponsiveVoice,
    })
    this.wanderingDescriber = new WanderingDescriber(protagonist)
    this.changeListener = new FactListener
    this.ctx = new DescriptionContext
    this.io.descriptionCtx = this.ctx
    this.mainTense = 'simple_present'
    this.dictionary = dictionary

    // set up soundplayer
    this.audioDestination = audioDestination
    if(this.audioDestination){
      this.mobileEar = new MobileEar({
        audioDestination: this.audioDestination,
        upDepth: 1
      })
      this.on('changeProtagonist',
        newProtagonist => {
          this.mobileEar.protagonist = newProtagonist
        }
      )
    }

    // every six seconds print a bit from the wandering describer
    setInterval(() => {
      let sentences = this.wanderingDescriber.nextFew(2)
      if(sentences)
        this.io.print(...sentences)
    }, 10000)
    let sentences = this.wanderingDescriber.nextFew(2)
    if(sentences)
      this.io.print(...sentences)

    // feed changes in game world into the io output
    this.changeListener.on('fact', change => {
      change.important = true
      this.io.print(change)
      this.wanderingDescriber.log(change)
    })

    // feed input from the GameIO into the Explorer Game
    this.io.on('input', str => this.input(str))



    /* The entity that the player 'is'*/
    this.protagonist = protagonist
  }

  input(str) {
    if(str == '') {
      let action = this.randomAction()
      this.io.monitor('Chosen random command: '+action.str('imperative') + '\n')
      return this.input(action.str('imperative'))
      /*this.io.monitor('> Random: '+action.str('imperative') + '\n')
      action.start()
      return*/
    }

    // emit an input event
    this.emit('input', str)

    // parse the string as an input
    let parsed = parse.imperative(this.protagonist, str, this.dictionary, this.ctx)
    if(parsed) {
      if(parsed.isParsedSentence) {
        let sentence = parsed.start()

        if(sentence.truthValue == 'true') {
          this.wanderingDescriber.log(sentence)
        } else if(sentence.truthValue == 'failed') {
          this.io.println(sentencify(sub(
            '_ because _',
            sentence.str('negative_possible_present'),
            sentence.failureReason,
          ).str()))
        } else {
          console.warn('Unhandled user instruction:', str, sentence)
        }
      } else if(parsed.isParsedSpecialSentence) {
        console.log(parsed.start())
      } else {
        console.warn('Unregognised parse object,', parsed, ', for \"'+str+'\"')
      }
    } else
      this.io.println("I'm sorry, I do not understand \""+str+"\"")
  }

  get protagonist() {
    // return the current protagonist
    return this._protagonist
  }
  set protagonist(newProtagonist) {
    // set a new protagonist
    if(!newProtagonist || !newProtagonist.isEntity)
      throw "Game#protagonist (set) expects a Entityenon"

    // remove listeners from old protagonist
    if(this._protagonist) {
      this._protagonist.removeListener('move', this.onProtagonistMove)
      this.changeListener.remove(this._protagonist)
    }

    // change the protagonist
    this._protagonist = newProtagonist

    // add listeners to the new protagonist
    newProtagonist.on('move', this.onProtagonistMove)
    this.changeListener.add(newProtagonist)

    // emit the `changeProtagonist` event
    this.emit('changeProtagonist', this._protagonist)
  }

  randomSentence() {
    return randomSentence(this.dictionary, this.protagonist)
  }

  randomAction() {
    return randomSentence.imperative(
      this.dictionary,
      this.protagonist,
      this.protagonist
    )
  }
}
module.exports = ExplorerGame
