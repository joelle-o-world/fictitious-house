const Sound = require('./Sound')
const getFolie = require('./getFolie')

class FolieSound extends Sound {
  constructor(type) {
    super()
    this.type = type
  }

  _generate() {
    return getFolie(this.type)
  }
}
module.exports = FolieSound
