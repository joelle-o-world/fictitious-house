// The index for all nouns.

module.exports = {
  'thing': require('./thing'),

  person: person => {
    person
      .be_a('thing')
      .allowLocationType('IN', 'ON')
      .allowLocatingType('hold')
      .allowLocatingType('wear')
      .allowLocatingType('consist')
    //person.pronoun = 'them'
  },
  human: 'person',
  woman: entity => {
    entity.be_a('person')
    entity.pronoun = 'her'
  },
  man: entity => {
    entity.be_a('person')
    entity.pronoun = 'him'
  }
}

Object.assign(module.exports, require('./rooms'))
Object.assign(module.exports, require('./items'))
Object.assign(module.exports, require('./plants'))
Object.assign(module.exports, require('./bodyparts'))
Object.assign(module.exports, require('./garments'))
Object.assign(module.exports, require('./food'))
Object.assign(module.exports, require('./animals'))

let phrasalNouns = Object.keys(module.exports).filter(noun => / /.test(noun))
Object.defineProperty(module.exports, 'phrasal', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: phrasalNouns
})
