const {SpecialSentenceSyntax} = require('english-io')

const Every = new SpecialSentenceSyntax('every #_ seconds, ~_', {
  start([d, sentence], domain) {
    setInterval(() => {
      sentence.start(domain)
    }, d*1000)
  }
})

module.exports.Every = Every
