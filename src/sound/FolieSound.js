const Sound = require('./Sound')
const getFolie = require('./getFolie')

class FolieSound extends Sound {
  constructor(type, looped=false) {
    super({
      behaviour: looped ? 'loop' : 'once'
    })
    this.type = type
  }

  _generate() {
    return getFolie(this.type)
  }
}
module.exports = FolieSound
