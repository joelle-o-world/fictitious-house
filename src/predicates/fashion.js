const {Predicate, S} = require('english-io')
const {Wear} = require('./location')
const GoTo = require('./GoTo')

const Don = new Predicate({
  forms: [
    {verb: 'don', params: ['subject', 'object']},
  ],

  prepare(person, garment) {
    return S(GoTo, person, garment)
  },
  until: callback => callback(),
  afterwards(person, garment) {
    return S(Wear, garment, person)
  }
})

module.exports.Don = Don
