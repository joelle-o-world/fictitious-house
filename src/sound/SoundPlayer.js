 // NOTE: a browser-only class
if(!AudioContext)
  throw "SoundPlayer only works in a browser with Web Audio API"

const ZEROLEVEL = 0.01

/**
 * @class SoundPlayer
 * @constructor
 * @param {WebAudioDestinationNode} destination
 */
class SoundPlayer {
  constructor(destination) {
    /**
     * @property {WebAudioDestinationNode} destination
     */
    this.destination = destination

    /**
     * A list of all the sounds currently playing, with mix details.
     * eg, {sound: [Sound object], mixParameters: [Object]}
     * @property {Array} currentMix
     */
    this.currentMix = []  // a list of all the sounds currently playing, with mix details
          // eg, {sound: [Sound object], mixParameters: {...}}

    this.awaiting = []
  }

  /**
   * @attribute ctx
   * @type {AudioContext}
   * @readOnly
   */
  get ctx() {
    return this.destination.context
  }

  /**
   * Change the entire mix and fade between states.
   * @method updateMix
   * @param {Array} nextMix
   * @param {Number} [adjustTime] Time taken for transition. (seconds)
   */
  updateMix(nextMix, adjustTime) {
    if(!nextMix || nextMix.constructor != Array)
      throw "updateMix expects an array of sound mixes"

    // stop and delete nowPlaying sounds not in nextSounds
    let nextSounds = nextMix.map(mix => mix.sound)
    let soundsToStop = this.currentMix.filter(mix => !nextSounds.includes(mix.sound))
    for(let {sound} of soundsToStop)
      this.stop(sound)

    // introduce nextSounds which are not already playing
    let currentSounds = this.currentMix.map(channel => channel.sound)
    let soundsToAdd = nextMix.filter(mix => !currentSounds.includes(mix.sound))
    for(let {sound, mixParameters} of soundsToAdd)
      this.play(sound, mixParameters)

    // adjust parameters of sounds which already exist
    let soundsToAdjust = nextMix.filter(channel =>
      !soundsToAdd.includes(channel.sound) &&
      !soundsToStop.includes(channel.sound)
    )
    for(let {sound, mixParameters} of soundsToAdjust)
      this.adjustChannel(sound, mixParameters, adjustTime)
  }


  /**
   * Add a new sound to the mix.
   * @method play
   * @async
   * @param {Sound} sound
   * @param {Object} [mixParameters]
   * @param {Number} [mixParameters.gain]
   */
  async play(sound, mixParameters={}) {

    //exit early if sound is already playing
    if(sound.soundPlayer == this)
      return ;


    sound.soundPlayer = this

    // await the buffer
    let buffer = await sound.audiobuffer

    // Exit if the sound has changed state during audio render.
    if(sound.soundPlayer != this || !sound.playing) {
      console.log(sound, 'changed its mind')
      return
    }

    // create a buffer source node
    let source = new AudioBufferSourceNode(this.ctx, {
      buffer: buffer,
      loop: sound.behaviour == 'loop',
    })

    // apply attenuation
    let gain = mixParameters.gain || 1
    let gainNode = this.ctx.createGain()
    if(sound.fadeIn) {
      gainNode.gain.setValueAtTime(ZEROLEVEL, this.ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(
        gain,
        this.ctx.currentTime+sound.fadeIn,
      )
    } else
      gainNode.gain.value = gain

    // connect to output
    source.connect(gainNode)
    gainNode.connect(this.destination)

    source.start()
    sound.emit('audioPlaying')

    let channel = {
      sound: sound,
      mixParameters: mixParameters,
      gainNode: gainNode,
      source: source,
    }
    this.currentMix.push(channel)

    source.onended = () => {
      let i = this.currentMix.indexOf(channel)

      if(i != -1)
        this.currentMix.splice(i, 1)

      sound.emit('audioPaused', source)
      if(sound.behaviour == 'once')
        sound.emit('end')
    }
  }

  /**
   * Stop a sound in the mix. Some sounds will stop immediately, others will
   * first fade out, then stop.
   * @method stop
   * @param {Sound|Number} sound The sound to stop or its index.
   */
  stop(sound) {
    // find the channel of the sound
    console.log(this, '.stop(', sound, ')')
    sound.soundPlayer = null

    let i
    if(sound.isSound)
      i = this.currentMix.findIndex(channel => channel.sound == sound)
    else if(sound.constructor == Number) {
      i = sound
      sound = this.currentMix[i].sound
    }
    let channel = this.currentMix[i]

    // fade it out or stop it immediately
    if(sound.fadeOut) {
      let endTime = sound.fadeOut + this.ctx.currentTime
      channel.gainNode.gain.linearRampToValueAtTime(ZEROLEVEL, endTime)
      channel.source.stop(endTime)
    } else {
      channel.source.stop()
    }


  }

  /**
   * Adjust the mix parameters of one sound in the mix.
   * @method adjustChannel
   * @param {Sound} sound
   * @param newMixParameters
   */
  adjustChannel(sound, newMixParameters={}, adjustTime=sound.adjustTime) {
    let channel = this.currentMix.find(c => c.sound == sound)

    let adjustedTime = this.ctx.currentTime + adjustTime

    // update attenuation
    if(newMixParameters.gain)
      channel.gainNode.gain.linearRampToValueAtTime(
        newMixParameters.gain, adjustedTime
      )
  }

  /**
   * Stop all of the sounds in the mix.
   * @method stopAll
   */
  stopAll() {
    for(let {sound} of this.currentMix)
      this.stop(sound)
  }
}
SoundPlayer.prototype.isSoundPlayer = true
SoundPlayer.ZEROLEVEL = ZEROLEVEL
module.exports = SoundPlayer
