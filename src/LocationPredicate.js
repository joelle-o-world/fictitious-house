const {Predicate} = require('english-io')

/**
 * @class LocationPredicate
 * @extends Predicate
 * @constructor
 * @param options
 * @param options.verb
 * @param [options.thing = "object"]
 * @param [options.location = "subject"]
 * @param options.locationType
 */

class LocationPredicate extends Predicate {
  constructor({
    verb,
    thing='object',
    location='subject',
    forms,
    locationType
  }) {
    super({
      verb: verb,
      params: [thing, location],
      forms: forms,
      begin: (A, B) => A.setLocation(B, locationType),
      check: (A, B) => A.location == B && A.locationType == locationType,
      until: (callback, A) => A.once('move', callback),
    })
  }
}
module.exports = LocationPredicate
