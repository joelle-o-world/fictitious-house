const TickyText = require("./TickyText")
const TTSQueue = require("./TTSQueue")

const myGame = require('./game1.js')

window.onload = function() {


  //document.getElementById('help').innerHTML = myGame.helpHTML
}

window.onclick = function() {
  let ticky_text = new TickyText(document.getElementById('output'))

  const tts = window.responsiveVoice ? new TTSQueue(window.responsiveVoice) : null

  myGame.write = str => {
    ticky_text.write(str)
    if(tts)
      tts.speak(str, "UK English Male", {rate: 1, pitch:1/2})
  }

  window.userInput = function(str) {
    myGame.input(str)
  }
  window.onclick = null

  myGame.main()
}
