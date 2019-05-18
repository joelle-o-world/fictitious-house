const Story = require('../src/Story')
const StoryLoader = require('./StoryLoader')

class StoryEditor {
  constructor(story, dictionary) {
    this.story = new Story(story)
    this.makeHTML()
    this.updateInterface()
    this.dictionary = dictionary
  }

  makeHTML() {
    let div = document.createElement('div')
    div.className = 'storyeditor'

    div.sidebar = document.createElement('div')
    div.sidebar.className = 'storyeditor_sidebar'
    div.appendChild(div.sidebar)

    div.debug = document.createElement('button')
    div.debug.innerText = 'debug'
    div.debug.disabled = true
    div.sidebar.appendChild(div.debug)

    div.play = document.createElement('button')
    div.play.innerText = 'play'
    div.play.onclick = () => this.play()
    div.sidebar.appendChild(div.play)

    div.storyInput = document.createElement('textarea')
    div.storyInput.className = 'storyeditor_input'
    div.storyInput.setAttribute('spellcheck', false)
    div.appendChild(div.storyInput)

    this.div = div
    return div
  }

  updateInterface(story=this.story) {
    this.div.storyInput.value = story.text
  }

  getStory() {
    return new Story({
      text: this.div.storyInput.value
    })
  }

  play() {
    let story = this.getStory()
    let loader = new StoryLoader(story, this.dictionary)
    this.gameWrapperDiv.appendChild(loader.div)
  }

  debug() {
    console.warn('StoryEditor: .debug() is not yet defined')
  }

  // TODO: getStory() // from this.interface
}
module.exports = StoryEditor
