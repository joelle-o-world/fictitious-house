const EventEmitter = require('events')
const {GameIO} = require('english-io').html
const {
  FactListener,
  WanderingDescriber,
  DescriptionContext,
  sentencify,
  parseImperative,
  sub,
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
    }, 6000)

    // feed changes in game world into the io output
    this.changeListener.on('fact', change => {
      this.io.print(change)
      this.wanderingDescriber.log(change)
    })

    // feed input from the GameIO into the Explorer Game
    this.io.on('input', str => this.input(str))



    /* The entity that the player 'is'*/
    this.protagonist = protagonist
  }

  input(str) {
    // emit an input event
    this.emit('input', str)

    // parse the string as an input
    let sentence = parseImperative.first(
      str, this.protagonist, this.dictionary.actionPredicates)
    if(sentence) {
      this.wanderingDescriber.log(sentence)
      sentence.on('problem', reason => {
        this.io.println(sentencify(sub(
          '_ because _',
          sentence.str('negative_possible_present'),
          reason
        ).str()))
      })
      sentence.start()
    } else
      this.io.println('Not understood.')
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
}
module.exports = ExplorerGame
