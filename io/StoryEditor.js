const Story = require('../src/Story')
const StoryLoader = require('./StoryLoader')

class StoryEditor {
  constructor(story, dictionary, options={}) {
    this.story = new Story(story)
    this.makeHTML(options)
    this.updateInterface()
    this.dictionary = dictionary
  }

  /*makeThumbnail() {
    if(this.thumbnail)
      return this.thumbnail

    // Otherwise,
    let div = document.createElement('div')
    div.className = 'storyeditor_thumbnail'

    div.storyName = document.createElement('span')
    div.storyName.className = 'title'
    div.appendChild(div.storyName)

    div.play = document.createElement('button')
    div.play.innerText = 'play'
    div.play.onclick = () => this.play()
    div.appendChild(div.play)

    div.edit = document.createElement('button')
    div.edit.innerText = 'edit'
    div.edit.onclick = () => this.editorWrapperDiv.appendChild(this.div)
    div.appendChild(div.edit)

    this.thumbnail = div
    return this.thumbnail
  }*/

  makeHTML({removeBTN = false}) {
    if(this.div)
      return this.div

    let div = document.createElement('div')
    div.editor = this
    div.className = 'storyeditor'

    div.storyInput = document.createElement('textarea')
    div.storyInput.className = 'storyeditor_input'
    div.storyInput.setAttribute('spellcheck', false)
    div.appendChild(div.storyInput)

    div.sidebar = document.createElement('div')
    div.sidebar.className = 'storyeditor_sidebar'
    div.appendChild(div.sidebar)

    div.debug = document.createElement('button')
    div.debug.innerText = 'debug'
    div.debug.onclick = () => this.debug()
    div.sidebar.appendChild(div.debug)

    if(removeBTN) {
      div.remove = document.createElement('button')
      div.remove.innerText = 'delete'
      div.remove.onclick = () => this.remove()
      div.sidebar.appendChild(div.remove)
    }

    div.play = document.createElement('button')
    div.play.innerText = 'play...'
    div.play.onclick = () => this.play()
    div.sidebar.appendChild(div.play)

    this.div = div
    return div
  }

  updateInterface(story=this.story) {
    this.story = new Story(story)
    this.div.storyInput.value = story.text
  //  this.thumbnail.storyName.innerText = story.title
  }

  getStory() {
    return new Story({
      text: this.div.storyInput.value
    })
  }

  play() {
    let story = this.getStory()
    let iframe = document.createElement('iframe')
    let div = document.createElement('div')
    div.className = 'game'

    iframe.className = 'game'
    iframe.onload = () => {
      iframe.contentWindow.setStory(story)
    }
    iframe.src = '../game/'

    let close = document.createElement('button')
    close.innerText = 'exit game'
    close.className = 'close'
    close.onclick = () => {
      this.gameWrapperDiv.removeChild(div)
    }

    div.appendChild(iframe)
    div.appendChild(close)
    this.gameWrapperDiv.appendChild(div)
  }

  debug() {
    console.warn('StoryEditor: .debug() is not yet defined')
  }

  remove() {
    this.div.parentNode.removeChild(this.div)
    if(window.saveStories)
      window.saveStories()
  }
  // TODO: getStory() // from this.interface
}
module.exports = StoryEditor
