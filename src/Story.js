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
  }
}
module.exports = Story
