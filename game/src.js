const StoryLoader = require('../io/StoryLoader')

const dictionary = require('../src/')


window.setStory = function(story) {
  let loader = new StoryLoader(story, dictionary)
  window.loader = loader
  document.body.appendChild(loader.div)
}
