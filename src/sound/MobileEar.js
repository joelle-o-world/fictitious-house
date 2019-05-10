const LocationSoundPlayer = require('./LocationSoundPlayer')

/**
 * The MobileEar class is used to set up sound listeners for the perspective of
 * a particular Entity, so that the output audio mimics what that entity should be
 * able to hear.
 * @class MobileEar
 * @constructor
 * @param options
 * @param {Entity} options.protagonist
 * @param {AudioDestinationNode} audioDestination
 * @param {Number} [upDepth=1]
 */
class MobileEar {
  constructor({protagonist, audioDestination, upDepth = 1}) {
    this.audioDestination = audioDestination
    console.log(this.audioDestination)
    this.upDepth = upDepth

    this.protagonist = protagonist

    this.moveCallback = () => this.refreshSoundPlayer()
    console.log('Ear', this)
  }

  get protagonist() {
    return this._protagonist
  }
  set protagonist(protagonist) {
    if(this._protagonist) {
      this._protagonist.removeListener('move', this.moveCallback)
    }

    this._protagonist = protagonist
    if(this._protagonist)
      this._protagonist.on('move', this.moveCallback)
    this.refreshSoundPlayer()
  }

  refreshSoundPlayer() {
    if(
      !this.mainPlayer
      || !this._protagonist
      || (this._protagonist.container != this.mainPlayer.location)
    ) {

      if(this.mainPlayer)
        this.mainPlayer.decomission()
      if(this._protagonist && this._protagonist.container) {
        this.mainPlayer = new LocationSoundPlayer({
          location: this._protagonist.container,
          audioDestination: this.audioDestination,
          upDepth: this.upDepth
        })
      }
    }
  }

  decomission() {
    this.mainPlayer.decomission()
    this.protagonist.removeListener('move', this.moveCallback)
  }
}
module.exports = MobileEar
