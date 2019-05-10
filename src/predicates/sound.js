const SoundPredicate = require('../sound/SoundPredicate')
const DuspLoop = require('../sound/DuspLoop')
const DuspOnce = require('../sound/DuspOnce')
const Buzzing = require('../sound/ambient/Buzzing')
const Hissing = require('../sound/ambient/Hissing')
const FolieSound = require('../sound/FolieSound')

module.exports = {
  buzz: new SoundPredicate({
    forms: [{verb: 'buzz'}, {verb:'make a buzzing sound'}],
    sound: () => new Buzzing
  }),

  ting: new SoundPredicate({
    forms:[
      {verb: 'go ting'},
      {verb: 'ting'},
    ],
    sound: () => new DuspOnce("((random * 1000 + 1500) -> Sq) * D1^10/10", 1)
  }),

  hiss: new SoundPredicate({
    forms: [
      {verb: 'hiss'},
      {verb: 'make a hissing sound'},
    ],
    sound: () => new Hissing
  }),

  drip: new SoundPredicate({
    forms: [
      {verb: 'drip'},
      {verb: 'make a dripping sound'},
    ],
    sound: () => new FolieSound('drip')
  }),

  Cough: new SoundPredicate({
    forms: [
      {verb: 'cough'}
    ],
    sound: () => new FolieSound('cough')
  }),

  Fart: new SoundPredicate({
    forms: [
      {verb: 'fart'},
      {verb: 'make a farting sound'}
    ],
    sound: () => new FolieSound('fart')
  }),

  Burp: new SoundPredicate({
    forms: [
      {verb: 'burp'},
      {verb: 'make a burping sound'}
    ],
    sound: () => new FolieSound('burp')
  }),

  MakeAnEatingSound: new SoundPredicate({
    forms: [
      {verb: 'make an eating sound'}
    ],
    sound: () => new FolieSound('eat')
  }),

  MakeAShatteringSound: new SoundPredicate({
    forms: [
      {verb: 'make a shattering sound'},
    ],
    sound: () => new FolieSound('shatter')
  })
}
