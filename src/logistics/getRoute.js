const getAccessibleLocations = require('./getAccessibleLocations')
const S = require('english-io').Sentence.S
const {goInto, getOnto, PassThrough, GoAcross} = require('../predicates/movement')

function getRoute(A, B) { // A and B are location,loctionType pairs
  let visited = [B] // an improvement could be to index the visited var by locationType
  let breadcrumbs = new Map()

  for(var i=0; i<visited.length; i++) {
    let locations = getAccessibleLocations(visited[i].location)
    for(let couple of locations) {
      // skip if has been visited
      if(visited.some(
        vis =>
          couple.location == vis.location &&
          couple.locationType == vis.locationType)
      ) continue

      visited.push(couple)
      breadcrumbs.set(couple, visited[i])

      if(couple.location == A.location
        && couple.locationType == A.locationType) {
        // found a route!

        // retrace breadcrumbs generate the route
        let trace = couple
        let route = [trace]
        while(trace=breadcrumbs.get(trace))
          route.push(trace)
        return route
      }
    }
  }

  return null
}
module.exports = getRoute

function getRouteSentences(A, B, subject) {
  let route = getRoute(A, B)
  if(!route)
    return null

  let instructions = []
  if(route.length > 1)
    instructions.push(S(PassThrough, subject, route[0].location))
  for(let i=1; i<route.length-1; i++) {

    let {location, locationType} = route[i]

    if(locationType == 'IN') {
      instructions.push(S(goInto, subject, location))
      instructions.push(S(PassThrough, subject, location))

    } else if(locationType == 'ON') {
      instructions.push(S(getOnto, subject, location))
      instructions.push(S(GoAcross, subject, location))
    }
  }

  let {location, locationType} = route[route.length-1]

  if(locationType == 'IN') {
    instructions.push(S(goInto, subject, location))

  } else if(locationType == 'ON') {
    instructions.push(S(getOnto, subject, location))
  }

  return instructions
}
module.exports.sentences = getRouteSentences
