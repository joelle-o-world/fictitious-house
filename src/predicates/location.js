const {Predicate} = require('english-io')
const LocationPredicate = require('../LocationPredicate.js')

module.exports = {
  beIn: new LocationPredicate({
    verb: 'be', thing: 'subject', location:'in', locationType:'IN'
  }),

  beOn: new LocationPredicate({
    verb: 'be',
    thing: 'subject', location: 'on',
    locationType: 'ON'
  }),

  hold: new LocationPredicate({
    verb: 'hold',
    locationType: 'hold'
  }),

  consistOf: new LocationPredicate({
    verb: 'consist',
    location: 'subject', thing: 'of',
    forms: [
      {verb: 'be part of', params:['subject', 'object']},
      {verb: 'be made', params:['of', 'subject']}
    ],
    locationType: 'consist'
  }),

  wear: new LocationPredicate({
    verb: 'wear',
    locationType: 'wear',
  }),

  // location related predicates
  leadTo: new Predicate({
    verb: 'lead',
    params: ['subject', 'to'],

    begin: (A, B) => A.connectTo(B),
    check: (A, B) => A.adjacentLocations.includes(B),
  }),
}
