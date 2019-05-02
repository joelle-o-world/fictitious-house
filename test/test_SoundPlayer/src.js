const ExplorerGame = require('../../io/ExplorerGame')
const {FactListener} = require('english-io')
const LocationSoundPlayer = require('../../src/sound/LocationSoundPlayer')
const Buzzing = require('../../src/sound/ambient/Buzzing')
const DuspLoop = require('../../src/sound/DuspLoop')
const d1 = require('../../src')

let allEntitys = d1.quickDeclare(
  'there is a person',
  'a room is called Room A',
  'another room is called Room B',
  'Room A leads to Room B',
  'a table is in Room A',
  'the person is in Room A',
  'a box is in Room B',
  'a cupboard is in Room B',
  'an octopus is in the box',
  'the octopus buzzes'
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
