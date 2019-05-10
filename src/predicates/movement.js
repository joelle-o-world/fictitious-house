const {Predicate} = require('english-io')
const {S, sub} = require('english-io')
const {WalkAcross, WalkThrough} = require('./walk')
//const getRoute = require('../logistics/getRoute')
const getAccessibleLocations = require('../logistics/getAccessibleLocations')
const dictionary = require('../index')
const FolieSound = require('../sound/FolieSound')

const GoInto = new Predicate({
  forms:[
    {verb: 'go', params: ['subject', 'into']},
    {verb: 'get', params: ['subject', 'into']},
    {verb: 'enter', params: ['subject', 'object']},
  ],

  skipIf(subject, container) {
    if(subject.location == container && subject.locationType == 'IN')
      return true
  },
  problem(subject, container) {
    if(!subject.location)
      return sub('_ is nowhere', subject)

    let accessibleLocations = [...getAccessibleLocations(subject.location)]
    if(!accessibleLocations.some(
      ({location, locationType}) => locationType == 'IN' && location == container
    ))
      return sub('_ is too far away', container)
  },
  until(callback, entity, container) {
    // Play a door sound if appropriate
    if(
      // one must be a room
      (entity.location.is_a('room') || container.is_a('room'))
      // both must be rooms or spaces
      &&(entity.location.is_a('room') || entity.location.is_a('space'))
      &&(container.is_a('room') || container.is_a('space'))
    ) {
      let sound = new FolieSound('door')
      sound.entitySource = entity
      sound.once('stop', () => callback())
      sound.start()
    } else
      callback()
  },
  afterwards(entity, container) {
    // set new location
    entity.setLocation(container, 'IN')
  },
})



const GetOnto = new Predicate({
  verb: 'get',
  params: ['subject', 'onto'],

  skipIf(subject, surface) {
    if(subject.location == surface && subject.locationType == 'ON')
      return true
  },
  problem(subject, surface) {
    if(!subject.location)
      return sub('_ is nowhere', subject)

    let accessibleLocations = [...getAccessibleLocations(subject.location)]
    if(!accessibleLocations.some(
      ({location, locationType}) => locationType == 'ON' && location == surface
    ))
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
    {verb:'leave'},
  ],
  replace(subject) {
    if(
      subject.locationType == 'IN' &&
      (subject.location.is_a('room') || subject.location.is_a('space'))
    ) {
      let options = subject.location.adjacentLocations
      if(options.length) {
        let room = options[Math.floor(Math.random()*options.length)]
        return dictionary.S('GoTo', subject, room)
      }
    } else if(subject.locationType == 'IN' && subject.location.open && subject.location.container) {
      return dictionary.S('GoTo', subject, subject.location.container)
    }

    return S(BeStuck, subject)
  }
})

const PassThrough = new Predicate({
  forms: [
    {verb: 'pass', params:['subject', 'through']},
    {verb: 'go', params:['subject', 'through']},
    {verb: 'cross', params:['subject', 'object']},
  ],
  actionable: false,

  replace(subject, container) {
    if(subject.findWithin('a foot'))
      return S(WalkThrough, subject, container)
  },

  problem(subject, container) {
    if(!subject.location)
      return sub('_ is nowhere', subject)

    if(subject.location == container && subject.locationType == 'IN')
      return null

    let accessibleLocations = [...getAccessibleLocations(subject.location)]
    if(!accessibleLocations.some(
      ({location, locationType}) => locationType == 'IN' && location == container
    ))
      return sub('_ is too far away', container)
  },
  begin(person, container) {
    person.setLocation(container, 'IN')
  },
  until: callback => callback(),
})

const GoAcross = new Predicate({
  forms: [
    {verb: 'go', params:['subject', 'across']},
    {verb: 'pass', params:['subject', 'over']},
    {verb: 'cross', params:['subject', 'object']}
  ],
  actionable: false,

  replace(subject, container) {
    if(subject.findWithin('a foot'))
      return S(WalkAcross, subject, container)
  },

  problem(subject, container) {
    if(!subject.location)
      return sub('_ is nowhere', subject)

    if(subject.location == container && subject.locationType == 'ON')
      return null

    let accessibleLocations = [...getAccessibleLocations(subject.location)]
    if(!accessibleLocations.some(
      ({location, locationType}) => locationType == 'IN' && location == container
    ))
      return sub('_ is too far away', container)
  },
  begin(person, container) {
    person.setLocation(container, 'ON')
  },
  until: callback => callback(),
})



Object.assign(module.exports, {
  // enter an IN location
  goInto: GoInto,

  // enter an ON location
  getOnto: GetOnto,

  Exit: Exit,

  BeStuck: BeStuck,

  PassThrough: PassThrough,
  GoAcross: GoAcross,
})
