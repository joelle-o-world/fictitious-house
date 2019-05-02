const TickyText = require('./TickyText.js')
const TTSQueue = require('./TTSQueue.js')

const game = require('../src/io/game2.js')

window.game = game

window.onclick = function() {
  let ticky_text = new TickyText(document.getElementById('output'))

  const tts = window.responsiveVoice ? new TTSQueue(window.responsiveVoice) : null

  game.on('output', str => {
    ticky_text.write(str)
    if(tts)
      tts.speak(str, "UK English Male", {rate: 1, pitch:1/2})
    console.log(game.declarer)
  })

  game.on('input', str => {
    ticky_text.writeln('> ' + str + ':\n\n')
    console.log(game.declarer)
  })

  window.userInput = function(str) {
    game.input(str)
  }
  window.onclick = null

  game.main()
}
