const predicates = require('../predicates/location')
const {S} = require('../../src/Sentence')

function getLocationFacts(entity, location, locationType) {
  if(!location || !entity)
    throw "getLocationFacts expects an object, location and locationType"

  switch(locationType) {
    case 'consist':
      return [
        S(predicates.consistOf, entity, location)
      ]

    case 'IN':
      return [
        S(predicates.beIn, entity, location)
      ]

    case 'hold':
      return [S(predicates.hold, entity, location)]

    case 'ON':
      return [S(predicates.beOn, entity, location)]

     case 'wear':
      return [S(predicates.wear, entity, location)]

    default:
      console.warn("Unknown locationType:", locationType)
      return []
  }
}
module.exports = getLocationFacts
