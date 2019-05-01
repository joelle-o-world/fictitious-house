const {components, quick, renderAudioBuffer, } = require('dusp')
const Sound = require('../Sound')

const MAINSFREQUENCY = 50 // Hz (UK & Europe)

class Buzzing extends Sound {
  constructor() {
    super({
      behaviour: 'loop',
    })
  }

  _generate() {
    let osc = new components.Osc()
    osc.F = MAINSFREQUENCY + Math.random() * 0.1
    osc.waveform = Math.random() < 0.5 ? 'saw' : 'square'

    let f = 10000 + Math.random()*10000
    let filter = new components.Filter(osc, f, 'HP')

    return renderAudioBuffer(quick.multiply(filter, 0.1*Math.random()), Math.random()*5)
  }
}
module.exports = Buzzing
