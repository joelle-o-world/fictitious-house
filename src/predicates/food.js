const {Predicate, S, sub} = require('english-io')

const Eat = new Predicate({
  forms: [
    {verb:'eat', params:['subject', 'object']},
    {verb:'dine', params:['subject', 'on']}
  ],

  prepare(eater, food) {
    return [
      S('Approach', eater, food)
    ]
  },

  problem(eater, food) {
    if(!food.is_a('food'))
      return sub('_ is not a food', food)
    else if(!eater.findWithin('a mouth'))
      return sub('_ has no mouth', eater)
  },

  expand(eater, food) {
    return [
      S('MakeAnEatingSound', eater),
      S('MakeAnEatingSound', eater),
      S('MakeAnEatingSound', eater),
    ]
  },

  afterwards(eater, food) {
    food.delete()
  }
})
module.exports.Eat = Eat

const FeedTo = new Predicate({
  forms: [
    {verb:'feed', params:['subject', 'object', 'to']},
  ],

  prepare(feeder, food, feedee) {
    return [
      S('PickUp', feeder, food),
      S('Approach', feeder, feedee)
    ]
  },

  expand(feeder, food, feedee) {
    return [S('Eat', feedee, food)]
  }
})
module.exports.FeedTo = FeedTo
