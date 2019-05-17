const {Predicate, S} = require('english-io')
const FolieSound = require('../sound/FolieSound')

const MoveInAParticularWay = new Predicate({
  forms: [
    {verb:'move in a particular way'}
  ]
})
module.exports.MoveInAParticularWay = MoveInAParticularWay


const WinTheGame = new Predicate({
  forms: [
    {verb:'win the game'},
  ],

  until: (callback, winner) => {
    let sound = new FolieSound('win')
    sound.once('end', () => callback())
    sound.entitySource = winner
    sound.start()
  }
})
module.exports.WinTheGame = WinTheGame


const LoseTheGame = new Predicate({
  forms: [
    {verb:'lose the game'},
  ],

  until: (callback, loser) => {
    let sound = new FolieSound('lose')
    sound.once('end', () => callback())
    sound.entitySource = loser
    sound.start()
  }
})
module.exports.LoseTheGame = LoseTheGame

const SayHelloTo = new Predicate({
  forms: [
    {verb:'say hello', params:['subject', 'to']},
  ],

  prepare(subject, object) {
    return S('Approach', subject, object)
  },

  until: (callback, subject) => {
    let sound = new FolieSound('hello')
    sound.once('end', () => callback())
    sound.entitySource = subject
    sound.start()
  },
})
module.exports.SayHelloTo = SayHelloTo

const SayHello = new Predicate({
  forms: [
    {verb:'say hello'},
  ],

  until: (callback, subject) => {
    let sound = new FolieSound('hello')
    sound.once('end', () => callback())
    sound.entitySource = subject
    sound.start()
  },
})
module.exports.SayHello = SayHello
