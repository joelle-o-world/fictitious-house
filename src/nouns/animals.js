module.exports = [
  { noun:'animal',
    inherits: 'thing',
    extend: e => e.allowLocationType('IN', 'ON', 'hold'),
  },
  { noun: 'octopus', inherits:'animal'},
  { noun: 'dolphin', inherits:'animal'},

  { noun: 'goose',
    inherits:'animal',
    modusOperandi: 'Every 7 seconds, make the sound of a goose.'
  },

  { noun: 'mule', inherits:'animal'},
  { noun: 'attic spider',
    inherits:'animal',
    consistsOf: ['3 legs'],
    modusOperandi: 'Move in a particular way. Make a scuttling sound.',
  }
]
