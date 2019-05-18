const {unSentencify, sentencify} = require('english-io')

class Story {
  constructor({
    text,
    protagonist=undefined,
    title=null,
  }) {
    this.text = text
    this.protagonist = protagonist
    let lines = unSentencify(text)
    this.title = title || sentencify(lines[0])
  }
}
module.exports = Story
