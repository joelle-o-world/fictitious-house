const {Predicate, S} = require('english-io')
const getRoute = require('../logistics/getRoute')

const Approach = new Predicate({
  forms: [
    {verb:'approach', params:['subject', 'object']},
    {verb:'go up to', params:['subject', 'object']}
  ],

  expand(mover, to) {
    if(mover.container == to.container)
      return []

    let route = getRoute.approach(mover, to)
    console.log('route', route)

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
})
module.exports = Approach
