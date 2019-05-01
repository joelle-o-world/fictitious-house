const getRoute = require('../logistics/getRoute')
const Predicate = require('../../src/Predicate')

let goTo = new Predicate({
  verb:'go', params:['subject', 'to'],

  skipIf: (subject, to) => (
    subject.location == to.location &&
    subject.locationType == to.locationType
  ),
  expand: (subject, to) => {
    let from = {location: subject.location, locationType:subject.locationType}
    return getRoute.sentences(from, to, subject)
  }
})

module.exports = goTo
