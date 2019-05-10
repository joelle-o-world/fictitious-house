const nouns = require('./nouns')
const adjectives = require('./adjectives')
const predicates = require('./predicates')
const consistsOfTree = require('./consistsOfTree')
const containsTree = require('./containsTree')
const modifiers = require('./modifiers')

const {Dictionary} = require('english-io')
const d1 = new Dictionary()
d1.addNouns(...nouns)
d1.addAdjectives(adjectives)
d1.addPredicates(...Object.values(predicates))
d1.addModifiers(...modifiers)

for(let noun in consistsOfTree) {
  d1.nouns[noun].consistsOf = consistsOfTree[noun]
}
for(let noun in containsTree) {
  d1.nouns[noun].contains = containsTree[noun]
}

module.exports = d1
