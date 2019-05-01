const {components, quick, renderAudioBuffer} = require('dusp')
const Sound = require('../Sound')

class Hissing extends Sound {
  constructor() {
    super({
      behaviour: 'loop',
      fadeIn:0.5,
      fadeOut:0.5,
    })
  }

  _generate() {
    let noise = new components.Noise()
    let f = 15000 + Math.random()*5000
    let filter = new components.Filter(noise, f, 'HP')


    return renderAudioBuffer(
      quick.multiply(filter, 0.03*Math.random()),
      Math.random()*5
    )
  }
}
module.exports = Hissing
