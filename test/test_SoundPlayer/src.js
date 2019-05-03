const ExplorerGame = require('../../io/ExplorerGame')
const {FactListener} = require('english-io')
const LocationSoundPlayer = require('../../src/sound/LocationSoundPlayer')
const Buzzing = require('../../src/sound/ambient/Buzzing')
const DuspLoop = require('../../src/sound/DuspLoop')
const d1 = require('../../src')

let allEntitys = d1.quickDeclare(
  'a man is in a vestibule',

  'the vestibule leads to a bedroom',
  'the vestibule leads to another bedroom',
  'the vestibule leads to a staircase',
  'the second bedroom is a living room',
  'the second bedroom leads to a garden',
  'the staircase leads to a landing',
  'the landing leads to another bedroom',
  'the landing leads to another bedroom',
  'the landing leads to another bedroom',
  'the staircase leads to another landing',
  'the second landing leads to a bathroom',

  'there is a wardrobe in the second bedroom',
  'there is a shirt in the wardrobe',

  'the vestibule leads to a street',
  'the street is called Cadiz Street.',
  'the street leads to the cemetary',
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
    useTickyText: true,
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
