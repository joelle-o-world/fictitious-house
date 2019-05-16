const SoundPlayer = require('./SoundPlayer')
const {getSubcontainers} = require('../logistics/getContainer')
const getImpulseResponse = require('../sound/getImpulseResponse')

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
  constructor({location, audioDestination, upDepth=1, parentPlayer=null}) {
    super(audioDestination)

    if(location.soundPlayer)
      throw 'Entity already has a sound player: ' + location.str()

    this.location = location
    this.location.soundPlayer = this
    this.parentPlayer = parentPlayer

    if(!this.parentPlayer && this.location.reverb) {
      let convolver = this.ctx.createConvolver()
      if(this.location.impulseResponse)
        convolver.buffer = this.location.impulseResponse
      else
        getImpulseResponse(location.reverb).then(buffer => {
          this.location.impulseResponse = buffer
          convolver.buffer = buffer
        })
      convolver.connect(this.destination)
      this.destination = convolver
    }

    // if main player, play already playing sounds of the location itself
    if(!this.parentPlayer)
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

      if(this.location.container && !this.location.container.soundPlayer)
        this.addSubPlayer(this.location.container)

      for(let neighbor of this.location.adjacentLocations)
        if(neighbor.isContainer)
          this.addSubPlayer(neighbor)
        else if(neighbor.container)
          this.addSubPlayer(neighbor.container)

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
    let list = [...this.location.locating]
    if(!this.parentPlayer)
      list.unshift(this.location)
    for(let i=1; i<list.length; i++) {
      let item = list[i]
      list.push(...item.locating.filter(
        subItem => subItem.locationType != 'IN' && !list.includes(subItem)
      ))
    }

    return list
  }

  get muffle() {
    if(!this._muffle) {
      let filter = this.ctx.createBiquadFilter()
      filter.frequency.value = 500 + Math.random()*1000
      filter.Q.value = 0
      let gain = this.ctx.createGain()
      gain.gain.value = 0.5

      filter.connect(gain)
      gain.connect(this.destination)

      this._muffle = filter
    }

    return this._muffle
  }

  addSubPlayer(entity) {
    let subPlayer = new LocationSoundPlayer({
      location: entity,
      audioDestination: this.muffle, // for now.
      upDepth: this.upDepth - 1,
      parentPlayer: this,
    })
    this.subPlayers.push(subPlayer)
  }

  removeSubPlayer(entity) {
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
    while(this.subPlayers.length)
      this.subPlayers[0].decomission()

    // remove self from parent player
    if(this.parentPlayer)
      this.parentPlayer.subPlayers.splice(
        this.parentPlayer.subPlayers.indexOf(this), 1
      )
  }
}
module.exports = LocationSoundPlayer
