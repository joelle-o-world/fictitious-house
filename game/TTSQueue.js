/*
  A class for scheduling text to speech in a queue.
*/

class TTSQueue {
  constructor(responsiveVoice) {
    this.queue = []
    this.nowPlaying = null
    this.rv = responsiveVoice
  }

  speak(text, voice, parameters) {
    if(!(/\w/).test(text))
      return "nah"

    if(this.nowPlaying)
      this.queue.push([text, voice, parameters])
    else
      this.playNow(text, voice, parameters)
  }

  playNow(text, voice, parameters) {
    parameters = Object.assign({}, parameters)
    parameters.onend = () => this.next()
    this.rv.speak(text, voice, parameters)
    this.nowPlaying = [text, voice, parameters]
  }

  next() {
    this.nowPlaying = null
    if(this.queue.length)
      this.playNow(...this.queue.shift())
    else
      this.done()
  }

  done() {
    this.nowPlaying = null
    if(this.onDone)
      this.onDone()
  }
}
module.exports = TTSQueue
