const S = require('english-io').Sentence.S
const {leadTo} = require('../predicates')

function connectLocations(entity1, entity2) {
  // this doesn't use location type for simplicity.
  if(!entity1.adjacentLocations.includes(entity2))
    entity1.adjacentLocations.push(entity2)
  if(!entity2.adjacentLocations.includes(entity1))
    entity2.adjacentLocations.push(entity1)

  S(leadTo, entity1, entity2).start()
  S(leadTo, entity2, entity1).start()
}

module.exports = connectLocations
