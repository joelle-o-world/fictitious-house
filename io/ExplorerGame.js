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
const {findBestMatch} = require('string-similarity')


/**
    @class ExplorerGame
    @extends EventEmitter
    @constructor
    @param {Entity} protagonist
*/
class ExplorerGame extends EventEmitter {
  constructor({
    protagonist, dictionary, audioDestination,
    useTickyText, useResponsiveVoice,
    specialSyntaxs=null,
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
    this.wanderingDescriber.includeHistory = true
    this.changeListener = new FactListener
    this.ctx = new DescriptionContext
    this.io.descriptionCtx = this.ctx
    this.mainTense = 'simple_present'
    this.dictionary = dictionary
    this.specialSyntaxs = []

    if(specialSyntaxs)
      this.addSpecialSyntaxs(...specialSyntaxs)

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
    this.lastSuggestion = null
    setInterval(() => {
      if(Math.random() < 0.75) {
        let sentences = this.wanderingDescriber.nextFew(2)
        if(sentences)
          this.io.print(...sentences)
      } else {
        let sentence = this.randomAction()
        this.lastSuggestion = sentence.str('imperative', this.ctx.duplicate())
        this.io.print(
          sentencify('perhaps '+ sentence.str('possible_present', this.ctx))+' '
        )
      }
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
      let action = this.lastSuggestion || this.randomAction().str('imperative')
      this.lastSuggestion = null
      this.io.monitor('Chosen random command: '+action + '\n')
      return this.input(action)
    }

    // emit an input event
    this.emit('input', str)

    // parse the string as an input
    let args
    for(let syntax of this.specialSyntaxs)
      if(args = syntax.parse(str, this.ctx, this.protagonist)) {
        let out = syntax.exec(args, this.protagonist)
        if(out) {
          this.io.print(out)
          return
        }
      }

    let parsed = parse.imperative(
      this.protagonist, str, this.dictionary, this.ctx
    )
    if(parsed) {
      if(parsed.isParsedSentence) {
        let sentence = parsed.start(this.protagonist)

        if(sentence.truthValue == 'true' || sentence.truthValue == 'replaced') {
          this.wanderingDescriber.log(sentence)
        } else if(sentence.truthValue == 'failed') {
          this.io.println(sentencify(sub(
            '_ because _',
            sentence.str('negative_possible_present'),
            sentence.failureReason,
          ).str()))
        } else if(sentence.truthValue == 'planned') {
          sentence.on('start', () => this.wanderingDescriber.log(sentence))
          sentence.on('problem', reason => this.io.println(sentencify(sub(
            '_ because _',
            sentence.str('negative_possible_present'),
            reason,
          ).str())))
        } else {
          console.warn('Unhandled user instruction:', str, sentence)
        }
      } else if(parsed.isParsedSpecialSentence) {
        parsed.start(this.protagonist)
      } else {
        console.warn('Unrecognised parse object,', parsed, ', for \"'+str+'\"')
      }
    } else if(parsed = parse.sentence(str, this.dictionary, this.ctx)) {
      let result = parsed.start(this.protagonist)
      if(result && result.isSentence)
        this.wanderingDescriber.log(result)
      else
        console.warn('Unhandled user declaration:', str)
    } else
      this.io.println(
        "I'm sorry, I do not understand \""+str+"\". "
        + 'Why not try entering: \"' + this.bestMatchAction(str, undefined, this.ctx.duplicate()) + '\"?'
      )
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

  bestMatchAction(str, n=50, ctx) {
    let choices = []
    for(let i=0; i<n; i++)
      choices.push(this.randomAction().str('imperative', ctx))

    let r =  findBestMatch(str, choices).bestMatch.target
    return r
  }

  addSpecialSyntaxs(...syntaxs) {
    for(let syntax of syntaxs) {
      syntax.dictionary = this.dictionary
      this.specialSyntaxs.push(syntax)
    }
  }
}
module.exports = ExplorerGame
