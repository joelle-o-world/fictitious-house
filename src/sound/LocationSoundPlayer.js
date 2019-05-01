const SoundPlayer = require('./SoundPlayer')
const {getSubcontainers} = require('../logistics/getContainer')

/*
  There are problems with this class.
*/

/**
 * @class LocationSoundPlayer
 * @extends SoundPlayer
 * @costructor
 * @param {Entity} location
 * @param {AudioDestinationNode} audioDestination
 */

class LocationSoundPlayer extends SoundPlayer {
  constructor({location, audioDestination, upDepth=1}) {
    super(audioDestination)
    if(location.soundPlayer)
      throw 'Entity already has a sound player: ' + location.str()

    this.location = location
    this.location.soundPlayer = this


    // play already playing sounds of the location itself
    for(let sound of this.location.nowPlayingSounds)
      this.play(sound)

    // play already playing sounds of entitys in the location
    for(let {nowPlayingSounds} of this.location.locating) {
      for(let sound of nowPlayingSounds)
        this.play(sound)
    }

    this.subPlayers = []

    this.upDepth = upDepth
    if(this.upDepth) {
      // set up subPlayers
      for(let subcontainer of getSubcontainers(this.location)) {
        if(!subcontainer.soundPlayer)
          this.addSubPlayer(subcontainer)
      }

      // set up recursive listening
      this.childEnterCallback = child => {
        // exit early if child is not in this container
        if(child.container == this.location)
          // if child is a container and is not already being tracked
          if(child.isContainer && !child.soundPlayer) {
            this.addSubPlayer(child)
          }
          for(let subcontainer of getSubcontainers(child))
            if(!subcontainer.soundPlayer &&
                subcontainer.container == this.location) {
              this.addSubPlayer(subcontainer)
            }
      }
      this.location.on('childEnter', this.childEnterCallback)

      this.childExitCallback = exiter => {
        if(exiter.container != this.location) {
          if(exiter.isContainer && exiter.soundPlayer)
            this.removeSubPlayer(exiter)
          for(let subcon of getSubcontainers(exiter))
            if(subcon.soundPlayer && subcon.soundPlayer.parentPlayer == this) {
              this.removeSubPlayer(subcon)
            }
        }
      }
      this.location.on('childExit', this.childExitCallback)
    }
  }

  getDomain() {
    // return a list of entitys which this player is responsibile for.
    let list = [this.location, ...this.location.locating]
    for(let i=1; i<list.length; i++) {
      let item = list[i]
      list.push(...item.locating.filter(
        subItem => subItem.locationType != 'IN' && !list.includes(subItem)
      ))
    }

    return list
  }

  addSubPlayer(entity) {
    console.log('addSubPlayer(', entity.str(), ')')

    if(!this.muffleDestination) {
      let gain = this.ctx.createGain()
      gain.gain.value = 0.3
      gain.connect(this.destination)
      this.muffleDestination = gain
    }

    let subPlayer = new LocationSoundPlayer({
      location: entity,
      audioDestination: this.muffleDestination, // for now.
      upDepth: this.upDepth - 1,
    })
    subPlayer.parentPlayer = this
    this.subPlayers.push(subPlayer)
  }

  removeSubPlayer(entity) {
    console.log('removeSubPlayer(', entity.str(), ')')
    let player = entity.soundPlayer
    if(player.parentPlayer == this)
      player.decomission()
  }

  decomission() {
    // stop all sounds
    this.stopAll()

    // remove listeners
    if(this.upDepth) {
      this.location.removeListener('childEnter', this.childEnterCallback)
      this.location.removeListener('childExit', this.childExitCallback)
    }

    // remove self from location
    this.location.soundPlayer = null
    this.location = null

    // decomission all subPlayers
    for(let player of this.subPlayers)
      player.decomission()

    // remove self from parent player
    if(this.parentPlayer)
      this.parentPlayer.subPlayers.splice(
        this.parentPlayer.subPlayers.indexOf(this), 1
      )
  }
}
module.exports = LocationSoundPlayer
