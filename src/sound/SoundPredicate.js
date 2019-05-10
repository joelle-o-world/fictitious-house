const {Predicate} = require('english-io')

class SoundPredicate extends Predicate {
  constructor(options) {
    // origin argument is always args[0]
    // sound function

    options.begin = (subject, sentence) => {
      if(options.sound) {
        let sound = options.sound(subject)
        if(sound) {
          sentence.sound = sound
          sound.once('stop', () => sentence.stop()) // UNTIL!!
          sound.entitySource = subject
          sound.start()
        }
      }
    }

    options.afterwards = (subject, sentence) => {
      sentence.sound.stop()
    }

    options.important = true

    super(options)
  }
}
module.exports = SoundPredicate
