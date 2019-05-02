module.exports = [
  require('./thing'),

  { noun: 'person',
    inherits:'thing',
    extend: e => e.allowLocatingType('hold', 'wear', 'consist')
                  .allowLocationType('IN', 'ON')
  },

  { noun: 'human', alias:'person' },
  { noun: 'woman', inherits:'person', extend: e => e.pronoun = 'her'},
  { noun: 'man', inherits:'person', extend: e => e.pronoun = 'him'},
  ...require('./rooms'),
  ...require('./items'),
  ...require('./plants'),
  ...require('./bodyparts'),
  ...require('./garments'),
  ...require('./food'),
  ...require('./animals'),
]

/*let phrasalNouns = Object.keys(module.exports).filter(noun => / /.test(noun))
Object.defineProperty(module.exports, 'phrasal', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: phrasalNouns
})*/
