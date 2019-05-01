const Predicate = require('../../src/Predicate')

class SoundPredicate extends Predicate {
  constructor(options) {
    // origin argument is always args[0]
    // sound function

    options.begin = (subject, sentence) => {
      if(options.sound) {
        let sound = options.sound(subject)
        if(sound) {
          sentence.sound = sound
          sound.once('stop', () => sentence.stop())
          sound.entitySource = subject
          sound.start()
        }
      }
    }

    options.afterwards = (subject, sentence) => {
      sentence.sound.stop()
    }

    super(options)
  }
}
module.exports = SoundPredicate
