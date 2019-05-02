module.exports = [
  { noun:'animal',
    inherits: 'thing',
    extend: e => e.allowLocationType('IN', 'ON', 'hold'),
  },
  { noun: 'octopus', inherits:'animal'},
  { noun: 'dolphin', inherits:'animal'},
  { noun: 'goose', inherits:'animal'},
  { noun: 'mule', inherits:'animal'}
]
