const {Predicate, S} = require('english-io')


const TellTo = new Predicate({
  forms: [{verb:'tell', params:['subject', 'object', '@to']}],

  prepare: (subject, object) => S('GoTo', subject, object),
  until: callback => callback(),
  afterwards(subject, object, to) {
    setTimeout(() => object.do(to), 4000)
  }
})
module.exports.TellTo = TellTo
