const {SentenceModifier} = require('english-io')
const delay = require('../delay')

const Every = new SentenceModifier(
  'every #_ seconds',
  function([interval], str, declare) {
    delay.interval(interval, () => declare(str))
  },
)
module.exports = Every
