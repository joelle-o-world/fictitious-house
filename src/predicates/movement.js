const {Predicate} = require('english-io')

module.exports = {
  // enter an IN location
  goInto: new Predicate({
    forms:[
      {verb: 'go', params: ['subject', 'into']},
      {verb: 'get', params: ['subject', 'into']},
      {verb: 'enter', params: ['subject', 'object']},
  ],

    until: callback => callback(),
    afterwards: (entity, container) => entity.setLocation(container, 'IN'),
  }),

  // enter an ON location
  getOnto: new Predicate({
    verb: 'get',
    params: ['subject', 'onto'],

    until: callback => callback(),
    afterwards: (entity, surface) => entity.setLocation(surface, 'ON'),
  }),
}
