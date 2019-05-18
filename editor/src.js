const story = require('../src/stories/Cadiz Street.json')
const StoryEditor = require('../io/StoryEditor.js')
const D = require('../src')



window.onload = function() {
  let editor1 = new StoryEditor(story, D)
  editor1.gameWrapperDiv = document.getElementById('game')
  document.getElementById('editor').appendChild(editor1.div)
}
