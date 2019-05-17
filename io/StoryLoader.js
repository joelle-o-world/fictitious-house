const {unSentencify, declare, DescriptionContext} = require('english-io')
const ExplorerGame = require('./ExplorerGame')

class StoryLoader {
  constructor(story, dictionary) {
    this.story = story
    this.dictionary = dictionary
    this.makeHTML()
  }

  makeHTML() {
    let div = document.createElement('DIV')
    div.className = 'gameloader'
    div.onclick = () => this.begin()

    let infoSpan = document.createElement('infoSpan')
    infoSpan.className = 'gameloader_info'
    infoSpan.innerText = 'Click to begin...'
    div.appendChild(infoSpan)

    this.infoSpan = infoSpan
    this.div = div
    return div
  }

  async begin() {
    let story = await this.story
    let sentences = unSentencify(this.story.text)

    let domain = []
    let ctx = new DescriptionContext

    for(let str of sentences) {
      this.info = 'Loading: '+ str
      await wait(10)
      let result
      try {
        result = declare.single(this.dictionary, ctx, domain, str)
      } catch(e) {
        console.warn(e)
      }
      if(result) {
        domain = result.domain
        ctx = result.ctx
      }
    }
    this.info = 'ready!'

    let game = new ExplorerGame({
      protagonist:domain[0],
      dictionary: this.dictionary,
      audioDestination: new AudioContext().destination,
      useResponsiveVoice: true,
      useTickyText: false,
      specialSyntaxs: this.dictionary.gameSyntaxs,
    })

    this.div.parentNode.replaceChild(game.io.div, this.div)
  }

  set info(str) {
    this.infoSpan.innerText = str
  }

  get info() {
    return this.infoSpan.innerText
  }
}
module.exports = StoryLoader


function wait(milliseconds=100) {
  return new Promise((fulfil) => setTimeout(fulfil, milliseconds))
}
