const {Predicate} = require('english-io')

const FeelGuilty = new Predicate({
  forms: [
    {verb:'feel guilty'},
    {verb:'feel naughty'},
    {verb:'feel a sense of shame'},
  ]
})
module.exports.FeelGuilty = FeelGuilty

const FeelSatisfied = new Predicate({
  forms: [
    {verb:'feel satisfied'},
    {verb:'feel sated'},
  ]
})
module.exports.FeelSatisfied = FeelSatisfied
