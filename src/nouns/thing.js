const getLocationFacts = require('./getLocationFacts.js')
const connectLocations = require('../logistics/connectLocations')
const subEntities = require('../logistics/subEntities')
const {search} = require('english-io')

function extend(o) {
    // where is this object
    o.location = null
    o.locationType = null
    o.possibleLocationTypes = []
    o.open = true
    o.adjacentLocations = []

    // object properties
    o.sizeInFootsteps = 1 + Math.random()* 3 // footsteps

    // what objects are here
    o.locating = []
    o.possibleLocatingTypes = []

    // functions:
    o.setLocation = setLocation
    o.delete = () => console.warn('thing:.delete() has not been implemented')
    o.canBeIn = canBeIn
    o.allowLocatingType = allowLocatingType
    o.allowLocationType = allowLocationType
    o.connectTo = to => connectLocations(o, to)

    o.emitParentMove = emitParentMove
    o.emitChildEnter = emitChildEnter
    o.emitChildExit = emitChildExit

    o.findWithin = findWithin
    o.isWithin = isWithin

    o.nowPlayingSounds = []

    // attributes:
    o.__defineGetter__('container', function() {
      // Recursively, search down the location tree to find the first `IN`
      // location.
      if(this.locationType == 'IN')
        return this.location
      else if(this.location)
        return this.location.container
      else
        return null
    })

    o.__defineGetter__('isContainer', function() {
      return this.possibleLocatingTypes.includes('IN')
    })

    // allow universal consistence
    o.allowLocatingType('consist')
    o.allowLocationType('consist')

    o.on('becomeNoun', noun => {
      if(noun.consistsOf) {
        let entities = this.dictionary.interpretSloppyList(
          noun.consistsOf
        )
        for(let e of entities) {
          if(!e.is_a('thing'))
            throw '`consistsOf` properties must be "things"'
          e.setLocation(o, 'consist')
        }
      }

      if(noun.contains) {
        let entities = this.dictionary.interpretSloppyList(
          noun.contains
        )
        for(let e of entities) {
          if(!e.is_a('thing'))
            throw '`contains` properties must be "things"'
          e.setLocation(o, 'IN')
        }
      }

      if(noun.reverb)
        o.reverb = noun.reverb
    })
}
module.exports = {noun:'thing', extend:extend}

function setLocation(location, locationType) {
  if(!locationType) {
    locationType = this.possibleLocationTypes.filter(
      lt => location.possibleLocatingTypes.includes(lt)
    )[0]
  }

  // check for problems
  if(!locationType || !this.canBeIn(location, locationType)) {
    console.warn(this.str(), this, location.str(), location)
    throw "incompatible locationType: "+locationType
  }

  // make a note of the old location for emitting an event
  let oldLocation = this.location
  let oldLocationType = this.locationType

  // exit early if hasn't really moved
  if(oldLocation == location && oldLocationType == locationType)
    return

  // remove self from old location
  if(this.location) {
    this.location.emit('exited', this, oldLocationType)
    this.location.locating.splice(this.location.locating.indexOf(this), 1)
  }

  // set new location
  this.location = location
  this.locationType = locationType

  if(oldLocation)
    oldLocation.emitChildExit(this)

  // add self to new location
  if(this.location) {
    this.location.emit('entered', this, locationType)
    this.location.locating.push(this)
    this.location.emitChildEnter(this)
  }

  this.emit('move',
    oldLocation,
    this.location,
    oldLocationType,
    this.locationType
  )
  for(let subEntity of this.locating)
    subEntity.emitParentMove()

  // get a list of location facts
  let newFacts = getLocationFacts(this, location, locationType)
  for(let fact of newFacts)
    fact.start()

  return this
}

// recursively emit parent move events through the location tree
function emitParentMove() {
  this.emit('parentMove')
  for(let subEntity of this.locating)
    subEntity.emitParentMove()
}
function emitChildEnter(enteringEntity) {
  this.emit('childEnter', enteringEntity)
  if(this.location)
    this.location.emitChildEnter(enteringEntity)
}
function emitChildExit(exitingEntity) {
  this.emit('childExit', exitingEntity)
  if(this.location)
    this.location.emitChildExit(exitingEntity)
}

function canBeIn(location, locationType) {
  return location.possibleLocatingTypes.includes(locationType) &&
    this.possibleLocationTypes.includes(locationType)
}

function allowLocationType(...locationTypes) {
  for(let locationType of locationTypes)
    if(!this.possibleLocationTypes.includes(locationType))
      this.possibleLocationTypes.push(locationType)
  return this
}
function allowLocatingType(...locationTypes) {
  for(let locationType of locationTypes)
    if(!this.possibleLocatingTypes.includes(locationType))
      this.possibleLocatingTypes.push(locationType)
  return this
}
function findWithin(str) {
  let list = [...search(str, subEntities(this))]
  return list.length ? list : null
}

function isWithin(e) {
  let loc = this

  do {
    if(loc == e)
      return true
  } while(loc = loc.location)

  // otherwise
  return false
}
