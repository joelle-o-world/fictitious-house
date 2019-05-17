const {Predicate, S} = require('english-io')
const getRoute = require('../logistics/getRoute')
const getReachable = require('../logistics/getReachable')

const Approach = new Predicate({
  forms: [
    {verb:'approach', params:['subject', 'object']},
    {verb:'go up to', params:['subject', 'object']}
  ],

  expand(mover, to) {
    for(let location of getReachable(to))
      if(location == mover.container)
        return []
  //  if(mover.container == to.container)
    //  return []

    let route = getRoute.approach(mover, to)

    let steps = []
    for(let i=1; i<route.length; i++) {
      let {location, locationType} = route[i]
      if(locationType == 'IN')
        steps.push( S('GoInto', mover, location) )
      if(locationType == 'On')
        steps.push( S('GetOnto', mover, location) )
    }

    return steps
  },
  banal: true,
})
module.exports = Approach
