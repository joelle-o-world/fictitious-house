const ExplorerGame = require('../io/ExplorerGame')
const {FactListener} = require('english-io')
const LocationSoundPlayer = require('../src/sound/LocationSoundPlayer')
const Buzzing = require('../src/sound/ambient/Buzzing')
const DuspLoop = require('../src/sound/DuspLoop')
const d1 = require('../src')
const {randomSentence} = require('english-io')
const gameSyntaxs = require('../src/gameSyntaxs')

console.log(d1)
let allEntitys = d1.declare(
  'a man is in a corridor',

  'the corridor leads to a kitchen',
  'a sausage is in the fridge',
  'the corridor leads to a bedroom',
  'the corridor leads to another bedroom',
  'the corridor leads to a staircase',
  'the second bedroom is a living room',
  'the second bedroom leads to a garden',
  'the staircase leads to a landing',
  'the landing leads to another bedroom',
  'the landing leads to another bedroom',
  'the landing leads to another bedroom',
  'the staircase leads to another landing',
  'the second landing leads to a bathroom',

  //'there is a bicycle in the corridor',
  //'there is another bicycle in the corridor',

  'the corridor leads to a street',
  'the street is called Cadiz Street',
  'Cadiz Street leads to another street that is called Date Street',
  'Date Street leads to the cemetery',
  'another street is called Walworth Road',
  'Cadiz Street leads to Walworth Road',
  'the cemetery leads to a church',

  'a goose is in the kitchen',
  'another man is in the cemetery',

  //'Every 10 seconds, the person farts',
  //'Every 13 seconds, the person burps',
).domain


let protagonist = allEntitys[0]
console.log('protagonist:', protagonist)
window.protagonist = protagonist

window.onclick = function() {
  window.onclick = null

  const audioctx = new AudioContext

  let game1 = new ExplorerGame({
    protagonist:protagonist,
    dictionary:d1,
    audioDestination: audioctx.destination,
    useResponsiveVoice: true,
    useTickyText: false,
    specialSyntaxs: gameSyntaxs,
  })
//  game1.ctx.you = protagonist
  document.body.appendChild(game1.io.div)
}
