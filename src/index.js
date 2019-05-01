const nouns = require('./nouns')
const adjectives = require('./adjectives')
const predicates = require('./predicates')

const Dictionary = require('../src/Dictionary')
const d1 = new Dictionary()
d1.addNouns(nouns)
d1.addAdjectives(adjectives)
d1.addPredicates(...Object.values(predicates))

module.exports = d1
