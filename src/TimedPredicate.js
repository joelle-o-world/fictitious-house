const {Predicate} = require('english-io')

/**
 * @class TimedPredicate
 * @extends Predicate
 * @constructor
 * @param {Object} options
 * @param {Number} options.duration
 */

class TimedPredicate extends Predicate {
  constructor(options) {
    options.until = callback => delay(options.duration, callback)
    super(options)
  }
}
module.exports = TimedPredicate

// delay with callback. in the future this function will allow for more nuanced
// game time, different from real-world time

function delay(seconds, callback) {
  setTimeout(callback, seconds*1000)
}
module.exports = delay
