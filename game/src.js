

const story = require('../src/stories/Cadiz Street.json')
console.log(story)
const StoryLoader = require('../io/StoryLoader')

const dictionary = require('../src/')


window.onload = function() {
  let loader = new StoryLoader(story, dictionary)
  document.body.appendChild(loader.div)
}
