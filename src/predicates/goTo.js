const getRoute = require('../logistics/getRoute')
const {Predicate} = require('english-io')

let goTo = new Predicate({
  verb:'go', params:['subject', 'to'],

  skipIf: (subject, to) => (
    subject.location == to.location &&
    subject.locationType == to.locationType
  ),
  expand: (subject, to) => {
    let from = {location: subject.location, locationType:subject.locationType}
    if(to.is_a('room') || to.is_a('space'))
      to = {location:to, locationType:'IN'}
    return getRoute.sentences(from, to, subject)
  }
})

module.exports = goTo
