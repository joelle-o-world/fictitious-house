module.exports = {
  room: room => {
    room
      .be_a('thing')
      .allowLocatingType('IN')
  },
  space: space => {
    space.be_a('thing')
    .allowLocatingType('IN')
  },
  kitchen: room => room.be_a('room'),
  bathroom: room => room.be_a('room'),
  living_room: room => room.be_a('room'),
  bedroom: room => room.be_a('room'),
  corridor: room => room.be_a('room'),
  garden: room => room.be_a('space'),
  hallway: room => room.be_a('room'),


}

module.exports = [
  {noun:'room', inherits:'thing', extend: e=>e.allowLocatingType('IN')},
  {noun:'space', inherits:'thing', extend: e=>e.allowLocatingType('IN')},

  {noun:'kitchen', inherits:'room'},
  {noun:'bathroom', inherits:'room'},
  {noun:'living room', inherits:'room'},
  {noun:'bedroom', inherits:'room'},
  {noun:'corridor', inherits:'room'},
  {noun:'hallyway', inherits:'room'},

  {noun:'garden', inherits:'space'},
  {noun:'street', inherits:'space'},
]
