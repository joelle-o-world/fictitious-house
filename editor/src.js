const story = require('../src/stories/Cadiz Street.json')
const StoryEditor = require('../io/StoryEditor.js')
const D = require('../src')



window.onload = function() {
  let editor1 = new StoryEditor(story, D)
  editor1.gameWrapperDiv = document.getElementById('games')
  editor1.editorWrapperDiv = document.getElementById('editor')
  document.getElementById('demos').appendChild(editor1.thumbnail)
}
