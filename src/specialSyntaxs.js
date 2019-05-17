const {SpecialSentenceSyntax} = require('english-io')

const EverySeconds_ = new SpecialSentenceSyntax('every #_ seconds,? ~_', {
  start([d, sentence], domain) {
    setInterval(() => {
      sentence.start(domain)
    }, d*1000)
  }
})

const _EverySeconds = new SpecialSentenceSyntax('~_,? every #_ seconds', {
  start([sentence, d], domain) {
    setInterval(() => {
      sentence.start(domain)
    }, d*1000)
  }
})

const _After_Seconds = new SpecialSentenceSyntax('~_,? after #_ seconds', {
  start([sentence, d], domain) {
    setTimeout(() => {
      sentence.start(domain)
    }, d*1000)
  }
})

const After_Seconds_ = new SpecialSentenceSyntax('after #_ seconds,? ~_', {
  start([d, sentence], domain) {
    setTimeout(() => {
      sentence.start(domain)
    }, d*1000)
  }
})

const _Then_ = new SpecialSentenceSyntax('~_,? then,? ~_', {
  start([A, B], domain) {
    if(A.isParsedSentence) {
      let s = A.create(domain)
      s.on('stop', () => {
        B.start(domain)
      })
      s.start()
    } else
      console.warn('unhandled "then" sentence')
  }
})

module.exports.EverySeconds_ = EverySeconds_
module.exports._EverySeconds = _EverySeconds
module.exports._After_Seconds = _After_Seconds
module.exports.After_Seconds_ = After_Seconds_
module.exports._Then_ = _Then_
