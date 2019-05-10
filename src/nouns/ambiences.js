const FolieSound = require('../sound/FolieSound')

module.exports = [
  { noun:'ambience',
    inherits:'thing',
    extend(e) {
      e.allowLocationType('IN', 'hold', 'ON')
    },
  },

  { noun: 'ambient room sound',
    inherits: 'ambience',
    extend(e) {
      let sound = new FolieSound('room', true)
      sound.entitySource = e
      sound.start()
    }
  },

  { noun: 'ambient outdoor sound',
    inherits: 'ambience',
    extend(e) {
      let sound = new FolieSound('sunny', true)
      sound.entitySource = e
      sound.start()
    }
  },
]
