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
  problem(person, garment) {
    if(!person.is_a('thing'))
      return sub('_ is not a physical entity', person)
    if(!garment.is_a('thing'))
      return sub('_ is not a physical entity', garment)
    if(!person.possibleLocatingTypes.includes('wear'))
      return sub('_ has no way of wearing things', person)
    if(!person.possibleLocationTypes.includes('wear'))
      return sub('_ is not a garment', person)
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
