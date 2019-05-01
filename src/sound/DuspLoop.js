const Sound = require('./Sound')
const {unDusp, renderAudioBuffer} = require('dusp')

/**
 * A class for generating looped (behaviour='loop') sounds from a Dusp string.
 * @class DuspLoop
 * @extends Sound
 * @constructor
 * @param {String} duspStr A string in dusp language.
 * @param {Number} [duration=10] in seconds.
 */
class DuspLoop extends Sound {
  constructor(duspStr, duration=10) {
    super()
    /**
     * @property {String} duspStr
     */
    this.duspStr = duspStr
    /**
     * @property {Number} duration
     */
    this.duration = duration

    this.behaviour = 'loop'
    this.fadeIn = 3
    this.fadeOut = 1
    this.adjustTime = 1
  }

  _generate() {
    return renderAudioBuffer(unDusp(this.duspStr), this.duration)
  }
}
module.exports = DuspLoop
