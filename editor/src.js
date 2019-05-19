const Story = require('../src/Story')
const StoryEditor = require('../io/StoryEditor.js')
const D = require('../src')
const demos = require('../src/stories')

const localEditors = []

window.onload = function() {
  for(let story of demos) {
    let editor1 = new StoryEditor(story, D)
    editor1.gameWrapperDiv = document.getElementById('games')
    document.getElementById('demos').appendChild(editor1.div)
  }
  refreshLocalStories()
}


function refreshLocalStories() {
  let stories = JSON.parse(window.localStorage.getItem('stories') || '[]')
    .map(s => new Story(s))

  let i
  for(i=0; i<stories.length; i++) {
    newEditor(stories[i])
  }
}
window.refreshLocalStories = refreshLocalStories

window.newEditor = function newEditor(story={text:''}) {
  let editor = new StoryEditor(story, D, {removeBTN:true})
  editor.gameWrapperDiv = document.getElementById('games')
  editor.div.storyInput.onchange = window.saveStories
  document.getElementById('savedstories').appendChild(editor.div)
}

window.saveStories = function() {
  let stories = []
  let divs = document.getElementById('savedstories').children
  for(let div of divs)
    stories.push(div.editor.getStory())
    //.map(div => div.editor.getStory())

  window.localStorage.setItem('stories', JSON.stringify(stories))
}
