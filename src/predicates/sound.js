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
  })
}
