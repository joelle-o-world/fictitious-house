const Declarer = require('../src/Declarer')
const spellcheck = require('../src/util/spellcheck')


const dec = new Declarer
dec.predicates.addPredicates(
  ...Object.values(require('../src/predicates'))
)


module.exports.main = function() {
  dec.declare(
    'a person is called Mike Roberts',
    'another person is called Nye',
    'another person is called Joel',
    'a room is called B5',
    'another room is called B4',
    'Joel is in B4',
    'Nye is in B4',
    'Mike Roberts is in B5',
    'the table is in B4',
    'the computer is on the table',
    'a chair is in B4',
    'another chair is in B4',
    //*/


    /*
    "a person is called Mihai",
    "the room that Mihai is in is called The Portico",
    "Mihai holds a cigarette",
    "another person that is called Karolina is in The Portico",
    'Karolina holds another cigarette',
    'Mihai smokes the cigarette that Mihai holds',
    'Karolina smokes the cigarette that Karolina holds',
    'another person that is in The Portico holds a salmon wrap',
    'the person that holds a salmon wrap is called Grace',


    'another room is called Gordons',
    'a salmon wrap is in Gordons',
    'a person is called Grace',
    'Grace is in Gordons',
    'Grace steals the salmon wrap',
    'Grace holds the salmon wrap',
    'another room is called The Classics Room',
    'The Classics Room contains Grace',
    'Grace steals the salmon wrap',
    */
  )

  setInterval(
    writeRandomFact,
    3500
  )

  writeRandomFact()
}

let lastFact = null
function writeRandomFact() {
  lastFact = null
  let entity
  if(lastFact)
    entity = lastFact.randomEntityArg()
  else
    entity = dec.randomEntity()

  let fact = entity.randomFact()
  write(fact.str(undefined, dec.ctx, 5), '\n\n')

  lastFact = fact
}

function write(...args) {
  for(let str of args)
    module.exports.write(spellcheck(str))
}

module.exports.input = function(str) {
//  write("\"", str, "\"\n")
  let sentence = dec.parse(str)
  sentence.declare()
  lastFact = sentence
}
