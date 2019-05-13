const ExplorerGame = require('../io/ExplorerGame')
const {FactListener} = require('english-io')
const LocationSoundPlayer = require('../src/sound/LocationSoundPlayer')
const Buzzing = require('../src/sound/ambient/Buzzing')
const DuspLoop = require('../src/sound/DuspLoop')
const d1 = require('../src')

let allEntitys = d1.quickDeclare(
  'a person is in a room',
  'a box is in the room',
  'the room leads to a garden',
  //'there is a box in the room',
  'a goose is in the room',
  'the box loves the goose',
  'every 10 seconds the goose makes the sound of a goose',
  'the room leads to a street',
  'the street leads to a cemetery',
  /*'a random person is in a corridor',

  'the corridor leads to a kitchen',
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

  'there is a bicycle in the corridor',
  'there is another bicycle in the corridor',

  'the corridor leads to a street',
  'the street is called Cadiz Street',
  'Cadiz Street leads to another street that is called Date Street',
  'Date Street leads to the cemetery',
  'another street is called Walworth Road',
  'Cadiz Street leads to Walworth Road',

  'there is a goose in the kitchen',
  'every 5 seconds the goose makes a farting sound',*/

  //'Every 10 seconds, the person farts',
  //'Every 13 seconds, the person burps',
)

let protagonist = allEntitys[0]
console.log('protagonist:', protagonist)

window.onclick = function() {
  window.onclick = null

  const audioctx = new AudioContext

  let game1 = new ExplorerGame({
    protagonist:protagonist,
    dictionary:d1,
    audioDestination: audioctx.destination,
    useResponsiveVoice: true,
    useTickyText: false,
  })
  document.body.appendChild(game1.io.div)



  /*let room = protagonist.container
  window.mySoundPlayer = new LocationSoundPlayer({
    location: room,
    audioDestination: audioctx.destination,
  })


  console.log(room.soundPlayer.getDomain().map(entity => entity.str()))*/

  /*let sound = new DuspLoop('Z50', 1)
  sound.entitySource = allEntitys[5]
  console.log(sound.entitySource.str(), 'is buzzing')
  sound.start()

  sound.on('move', (oldLocation, newLocation) => {
    console.log('movement', oldLocation.str(), 'to', newLocation.str())
  })*/
}
