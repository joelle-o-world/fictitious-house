const {Predicate} = require('english-io')
const S = require('english-io').Sentence.S
const TimedPredicate = require('../TimedPredicate')
//const {goTo} = require('./movement')
const goTo = require('./goTo')
const {hold, beOn, beIn} = require('./location')

const pickUp = new TimedPredicate({
  // form
  verb: 'pick up', params: ['subject', 'object'],

  // semantics
  skipIf: (sub, ob) => ob.location == sub && ob.locationType == 'hold',
  prepare: (subject, object) => [S(goTo, subject, object)],
  duration: 1,
  afterwards: (subject, object) => S(hold, object, subject),
})
console.log(pickUp)

module.exports = {
  lookAt: new Predicate({
    verb: 'look',
    params: ['subject', 'at'],
    prepare: (subject, object) => [S(goTo, subject, object)]
  }),

  // Picking up and putting down:
  pickUp: pickUp,

  putIn: new TimedPredicate({
    forms: [
      {verb: 'put', params:['subject', 'object', 'in']},
      {verb: 'put', params:['subject', 'object', 'inside']},
    ],
    duration: 1,
    prepare: (actor, object, container) => [
      S(pickUp, actor, object),
      S(goTo, actor, container),
    ],
    afterwards: (actor, object, container) => S(beIn, object, container)
  }),

  putOn: new TimedPredicate({
    forms: [
      {verb:'put', params:['subject', 'object', 'on']},
      {verb:'place', params:['subject', 'object', 'on']}
    ],
    duration: 1,
    prepare: (actor, object, surface) => [
      S(pickUp, actor, object),
      S(goTo, actor, surface),
    ],
    afterwards: (actor, object, surface) => S(beOn, object, surface)
  })
}
