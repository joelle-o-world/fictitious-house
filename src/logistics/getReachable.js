const {getSubcontainers} = require('./getContainer')

/** Return a list of locations from which a entity thing can be reached */
function* getReachable(A) {
  // e's container
  if(A.container) {
    yield A.container
    /*if(A.container.container)
      yield A.container.container*/
  }

  // Any containers inside A
  for(let c of getSubcontainers(A))
    yield c

  // Any adjacent locations to e
  for(let l of A.adjacentLocations)
    yield l
}
module.exports = getReachable
