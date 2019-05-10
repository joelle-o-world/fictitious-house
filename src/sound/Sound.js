const EventEmitter = require('events')


/**
 * Sound objects are attached to entity objects, they represent a sonic behaviour
 * of that entity.
 * @class Sound
 * @extends EventEmitter
 * @constructor
 * @param [options]
 * @param {String} [options.behaviour = "once"]
 *  Either 'loop' or 'once'. Determines the behaviour of the sound.
 * @param {Number|null} [options.fadeIn = null]
 *  Fade in time for the sound, in seconds.
 * @param {Number|null} [options.fadeOut = 0.25]
 *  Fade out time for the sound, in seconds.
 */

/**
 * @event start
 */
/**
 * @event stop
 */
/**
 * @event end
 */
/**
 * @event audioPlaying
 */
/**
 * Emitted wheneve the entity source moves between SoundPlayer domains.
 * @event move
 * @param oldLocation
 * @param newLocation
 */
/**
 * @event audioPaused
 */
class Sound extends EventEmitter {
  constructor({
    behaviour = "once",
    fadeIn = null,
    fadeOut = 0.25,
  } = {}) {
    super()
    // BEHAVIOUR DETAILS:
    /**
     * Either 'loop' or 'once'. Determines the behaviour of the sound.
     * @property {String} behaviour
     */
    this.behaviour = behaviour // "loop" or "once" (Add more later)

    /**
     * Fade in time for the sound, in seconds.
     * @property {Number|null} fadeIn
     */
    this.fadeIn = fadeIn  // null or fade in duration in seconds

    /**
     * Fade out time for the sound, in seconds.
     * @property {Number|null} fadeOut
     */
    this.fadeOut = fadeOut    // null or fade out duration in seconds

    /**
     * Time taken to adjust mix parameters for the sound, in seconds
     * @property {Number} adjustTime
     * @default 0.25
     */
    this.adjustTime = 0.25

    // buffer/sample/generation
    /**
     * An audiobuffer of a pre-rendered sample.
     * @property {AudioBuffer|null} _audiobuffer
     */
    this._audiobuffer = null // an audiobuffer of a pre-rendered sample

    /**
     * A generative process to make this sound.
     * @property {Function|null} _generate
     */
    this._generate // function, a generative way to make this sound

    /**
     * The Entity that is the origin of the sound.
     * @property {Entity} entitySource
     */
    this.entitySource = null

    // audio status
    /**
     * `true` if the sound is playing (in an abstract sense). If `playing` is
     * `true` this does not necessarily mean that audio is playing (The sound
     * will not process audio when it is playing but inaudible). Use
     * `nowPlayingAudio` to check if audio is being processed.
     * @attribute playing
     * @type Boolean
     * @readOnly
     */
    this.playing = false

    /**
     * `true` if audio is processing.
     * @attribute nowPlayingAudio
     * @type Boolean
     * @readOnly
     */
    this.nowPlayingAudio = false

    /**
     * @property {SoundPlayer} soundPlayer
     */
    this.soundPlayer = null


    this.on('audioPlaying', () => {
      if(this.nowPlayingAudio) {
        //console.warn( 'a sound cannot play in two places at once' )
      } else
        this.nowPlayingAudio = true
    })
    this.on('audioPaused', () => {
      this.nowPlayingAudio = false
    })

    // called when the entitySource moves
    this.onmove = (x) => {
      let oldSoundPlayer = this.soundPlayer
      let newSoundPlayer = this.findSoundPlayer()

      if(oldSoundPlayer != newSoundPlayer) {
        console.log('moveing sound', this)
        // stop self in old sound player
        if(oldSoundPlayer)
          oldSoundPlayer.stop(this)

        // start self in new sound player
        if(newSoundPlayer)
          newSoundPlayer.play(this)
      }
    }
  }

  /**
   * @attribute audiobuffer
   * @type AudioBuffer
   * @readOnly
   */
  get audiobuffer() {
    if(this._audiobuffer)
      return this._audiobuffer
    else if(this._generate)
      return this.generate()

    console.warn('could not generate audio buffer', this)
  }

  /**
   * @method generate
   * @async
   */
  async generate() {
    if(!this._generate)
      console.warn("sound has no generate function")
    this._audiobuffer = await this._generate()
    if(!this._audiobuffer)
      console.warn("sound.generate() failed")
    return this._audiobuffer
  }

  /**
   * Start the sound conceptually (even if not audible).
   * @method start
   */
  start() {
    // start the sound conceptually
    if(this.isContinuous) {
      this.playing = true
      this.entitySource.nowPlayingSounds.push(this)
      this.once('stop', () => {
        let i = this.entitySource.nowPlayingSounds.indexOf(this)
        if(i != -1)
          this.entitySource.nowPlayingSounds.splice(i, 1)
      })
    }
    if(this.isAudible) {
      this.playing = true
      let player = this.findSoundPlayer()
      if(this.isContinuous) {
        // sound is audible and continuous
        this.emit('start')
        player.play(this)

        // create event listners on entity
        this.entitySource.on('move', this.onmove)
        this.entitySource.on('parentMove', this.onmove)
      } else {
        // sound is audible and non-continuous, so play it once then stop it.
        this.once('audioPaused', () => {
          this.stop()
        })
        this.emit('start')
        player.play(this)
      }
    } else {
      if(this.isContinuous) {
        // sound is inaudible and continuous
        this.playing = true
        this.emit('start')

        // create event listeners
        this.entitySource.on('move', this.onmove)
        this.entitySource.on('parentMove', this.onmove)
      } else {
        // sound is inaudible and non-continuous, so skip straight to end
        this.emit('end')
        return null
      }
    }
  }

  /**
   * Conceptually stop the sound.
   * @method stop
   */
  stop() {
    if(this.nowPlayingAudio) {
      // audio is playing, so stop the the audio then end the sound
      this.playing = false
      this.emit('stop')
      this.once('audioPaused', () => {
        this.emit('end')
      })
      this.soundPlayer.stop(this)
    } else {
      // audio is not playing, so end the sound immediately
      this.playing = false
      this.emit('stop')
      this.emit('end')
    }

    // remove 'move' listeners on the entitySource
    this.entitySource.removeListener('move', this.onmove)
    this.entitySource.removeListener('parentMove', this.onmove)
  }

  /**
   * `true` if the sound plays forever. For example, if it loops.
   * @attribute isContinous
   * @type Boolean
   * @readOnly
   */
  get isContinuous() {
    return this.behaviour == 'loop'
  }
  /**
   * `true` if the sound is, or could be, audible. Doesn't matter whether the
   * sound is playing or not.
   * @attribute isAudible
   * @type Boolean
   * @readOnly
   */
  get isAudible() {
    if(this.findSoundPlayer())
      return true
    else
      return false
  }

  findSoundPlayer() {
    if(!this.entitySource)
      return false

    if(this.entitySource.container && this.entitySource.container.soundPlayer)
      return this.entitySource.container.soundPlayer

    else if(
      !this.entitySource.container
      && this.entitySource.soundPlayer
    )
      return this.entitySource.soundPlayer
  }
}
Sound.prototype.isSound = true
module.exports = Sound
