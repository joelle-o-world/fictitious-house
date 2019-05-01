const {Predicate} = require('english-io')
const TimedPredicate = require('../TimedPredicate')

module.exports = {
  // LOCATION

  // OTHER
  beCalled: new Predicate({
    verb:'be',
    params:['subject', '@called'],
    begin: (A, name) => A.name = name,
    check: (A, name) => A.name == name,
  }),

  be: new Predicate({
    verb: 'be',
    params: ['subject', '@object'],
    begin: (entity, adjective) => entity.be(adjective),
  }),

  beA: new Predicate({
    verb: 'be',
    params: ['subject', '@a'],
    begin: (entity, classname) => entity.be_a(classname),
    check: (entity, className) => entity.is_a(className),
    banal: true,
  }),

  smoke: new Predicate({
    verb: 'smoke',
    params: ['subject', 'object'],
  }),

  love: new Predicate({
    verb: 'love',
    params: ['subject', 'object'],
  }),

  jump: new TimedPredicate({
    verb: 'jump', params:['subject'],
    duration:5,
  }),

  steal: new Predicate({
    verb:'steal',
    params: ['subject', 'object'],
    until: callback => callback(),
  }),

  thereIs: new Predicate({
    forms: [
      {verb:'be', params:['object'], constants:{_subject:'there'}},
      {verb:'exist', params:['subject']},
    ],
    banal: true,
  }),

  gaveTo: new Predicate({
    forms: [
      {verb:'give', params:['subject', 'object', 'to']},
    ]
  })
}

Object.assign(module.exports, require('./location'))
Object.assign(module.exports, require('./movement'))
Object.assign(module.exports, require('./actions'))
Object.assign(module.exports, require('./sound'))
module.exports.goTo = require('./goTo')
