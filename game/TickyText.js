class TickyText {
  constructor(targetElement) {
    this.queue = []
    this.placeInCurrent = 0 // Index of next character to print from
    this.intervalTimer = null
    this.str = ""
    this.speed = 25 // ms

    this.targetElement = targetElement
  }

  write(...stuff) {
    // add stuff to the print queue
    for(var i in stuff) {
      if(stuff[i].constructor != String)
        throw "TickyText#write expects String arguments."
      this.queue.push(stuff[i])
    }
    if(!this.intervalTimer)
      this.startTicking()
  }

  writeln(...str) {
    for(var i in str)
      this.write(str[i])
    this.write("\n")
  }

  startTicking() {
    // begin printing characters to target/string
    this.intervalTimer = setInterval(() => {
      this.tick()
    }, this.speed)
  }
  stopTicking() {
    // pause printing
    if(this.intervalTimer)
      clearInterval(this.intervalTimer)
    this.intervalTimer = null

    if(this.onStopTicking)
      this.onStopTicking()
  }

  tick() {
    // read next character to string
    this.str += this.queue[0][this.placeInCurrent]

    // copy string to target element
    if(this.targetElement)
      this.targetElement.innerHTML = this.str

    // increment index in current string
    ++this.placeInCurrent
    // proceeed to next string at end. If no more strings stop ticking.
    if(this.placeInCurrent >= this.queue[0].length) {
      this.queue.shift()
      this.placeInCurrent = 0
      if(this.queue.length == 0)
        this.stopTicking()
    }
  }
}
module.exports = TickyText
