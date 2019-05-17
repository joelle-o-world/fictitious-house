const {Predicate, sub} = require('english-io')
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
  prepare: (subject, object) => [S('Approach', subject, object)],
  duration: 1,
  afterwards: (subject, object) => S(hold, object, subject),
})



module.exports = {
  lookAt: new Predicate({
    verb: 'look',
    params: ['subject', 'at'],
    prepare: (subject, object) => S(goTo, subject, object)
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
      S('Approach', actor, container),
    ],
    problem(actor, object, container) {
      if(!container.possibleLocatingTypes.includes('IN'))
        return sub('_ is not a container', container)
    },
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
      S('Approach', actor, surface),
    ],
    problem(actor, object, surface) {
      if(!surface.possibleLocatingTypes.includes('ON'))
        return sub('_ is not a level surface', surface)
    },
    afterwards: (actor, object, surface) => S(beOn, object, surface)
  }),

  steal: new Predicate({
    verb:'steal',
    params: ['subject', 'object'],
    prepare(thief, booty) {
      return this.dictionary.S('GoTo', thief, booty)
    },
    expand(thief, booty) {
      return [
        this.dictionary.S('PickUp', thief, booty),
        this.dictionary.S('GoOut', thief)
      ]
    },
    until: callback => callback(),
  }),
}
