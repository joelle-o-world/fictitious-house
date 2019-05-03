const {Predicate, S, sub} = require('english-io')
const {Wear} = require('./location')
const GoTo = require('./GoTo')

const Don = new Predicate({
  forms: [
    {verb: 'don', params: ['subject', 'object']},
    {verb: 'wear', params: ['subject', 'object']},
    {verb: 'put on', params: ['subject', 'object']},
  ],

  prepare(person, garment) {
    return S(GoTo, person, garment)
  },
  until: callback => callback(),
  afterwards(person, garment) {
    return S(Wear, garment, person)
  }
})

const TakeOff = new Predicate({
  forms: [
    {verb: 'take off', params:['subject', 'object']},
  ],

  problem(person, garment) {
    if(garment.location != person || garment.locationType != 'wear')
      return sub('_ is not wearing _', person, garment)
  },
  until: callback => callback,
  afterwards(person, garment) {
    garment.setLocation(person, 'hold')
  }
})

module.exports.Don = Don
module.exports.TakeOff = TakeOff
