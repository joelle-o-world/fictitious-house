const {Predicate} = require('english-io')
const {S, sub} = require('english-io')
//const getRoute = require('../logistics/getRoute')
const getAccessibleLocations = require('../logistics/getAccessibleLocations')

const GoInto = new Predicate({
  forms:[
    {verb: 'go', params: ['subject', 'into']},
    {verb: 'get', params: ['subject', 'into']},
    {verb: 'enter', params: ['subject', 'object']},
  ],

  problem(subject, container) {
    if(!subject.location)
      return sub('_ is nowhere', subject)

    let accessibleLocations = [...getAccessibleLocations(subject.location)]
    if(!accessibleLocations.includes(container))
      return sub('_ is too far away', container)
  },
  until: callback => callback(),
  afterwards: (entity, container) => entity.setLocation(container, 'IN'),
})



const GetOnto = new Predicate({
  verb: 'get',
  params: ['subject', 'onto'],

  problem(subject, surface) {
    if(!subject.location)
      return sub('_ is nowhere', subject)

    let accessibleLocations = [...getAccessibleLocations(subject.location)]
    if(!accessibleLocations.includes(surface))
      return sub('_ is inaccessible', surface)
  },
  until: callback => callback(),
  afterwards: (entity, surface) => entity.setLocation(surface, 'ON'),
})

const BeStuck = new Predicate({
  forms:[{verb:'be stuck'}],
  until: callback => callback(),
})

const Exit = new Predicate({
  forms:[
    {verb:'exit', params:['subject']},
    {verb:'go out'},
    {verb:'get out'},
  ],
  replace(subject) {
    if(
      subject.locationType == 'IN' &&
      (subject.location.is_a('room') || subject.location.is_a('space'))
    ) {
      let options = subject.location.adjacentLocations
      if(options.length) {
        let room = options[Math.floor(Math.random()*options.length)]
        return S(GoInto, subject, room)
      }
    } else if(subject.locationType == 'IN' && subject.location.open && subject.location.container) {
      return S(GoInto, subject, subject.location.container)
    }

    return S(BeStuck, subject)
  }
})



module.exports = {
  // enter an IN location
  goInto: GoInto,

  // enter an ON location
  getOnto: GetOnto,

  Exit: Exit,

  BeStuck: BeStuck,
}
