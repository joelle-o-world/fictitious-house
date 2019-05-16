const getRoute = require('../logistics/getRoute')
const {Predicate, sub} = require('english-io')

let goTo = new Predicate({
  verb:'go', params:['subject', 'to'],

  skipIf: (subject, to) => (
    subject.location == to.location &&
    subject.locationType == to.locationType
  ),
  expand: (subject, to) => {
    let from = {location: subject.location, locationType:subject.locationType}
    if(to.possibleLocatingTypes.includes('IN'))
      to = {location: to, locationType:'IN'}
    else if(to.possibleLocatingTypes.includes('ON'))
      to = {location: to, locationType:'IN'}
    else if(to.locationType == 'ON')
      to = {location:to.location, locationType:'ON'}
    else if(to.container)
      to = {location:to.container, locationType: 'IN'}
    /*if(to.is_a('room') || to.is_a('space'))
      to = {location:to, locationType:'IN'}*/
    return getRoute.sentences(from, to, subject)
  },
  problem(subject, to) {
    console.log(subject.str(), to.str())
    if(to.isWithin(subject))
      return sub('_ is part of _', to, subject)

    let from = {location: subject.location, locationType:subject.locationType}
    if(to.possibleLocatingTypes.includes('IN'))
      to = {location: to, locationType:'IN'}
    else if(to.possibleLocatingTypes.includes('ON'))
      to = {location: to, locationType:'IN'}
    else if(to.locationType == 'ON')
      to = {location:to.location, locationType:'ON'}
    else if(to.container)
      to = {location:to.container, locationType: 'IN'}

    /*if(to.is_a('room') || to.is_a('space'))
      to = {location:to, locationType:'IN'}*/
    let route = getRoute.sentences(from, to, subject)
    if(!route)
      return 'there is no way there'
  },
  banal: true,
})

module.exports = goTo
