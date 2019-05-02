module.exports = [
  { noun: 'person',
    inherits:'thing',
    extend: e => e.allowLocatingType('hold', 'wear', 'consist')
                  .allowLocationType('IN', 'ON')
  },

  { noun: 'human', alias:'person' },
  { noun: 'woman', inherits:'person', extend: e => e.pronoun = 'her'},
  { noun: 'man', inherits:'person', extend: e => e.pronoun = 'him'},
]
