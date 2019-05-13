module.exports = [
  {
    noun:'room',
    inherits:'thing',
    extend(e) {
      e.allowLocatingType('IN')
      e.sizeInFootsteps = Math.floor(Math.random()*10 + 4)
    },
    reverb: 'living-room',
  },
  {
    noun:'space',
    inherits:'thing',
    extend(e) {
      e.allowLocatingType('IN')
      e.sizeInFootsteps = Math.floor(Math.random()*10 + 4)
    },
  },

  {noun:'kitchen', inherits:'room', reverb:'kitchen'},
  {noun:'bathroom', inherits:'room', reverb:'bathroom'},
  {noun:'living room', inherits:'room'},
  {noun:'bedroom', inherits:'room'},
  {noun:'corridor', inherits:'room'},
  {noun:'hallway', inherits:'room'},
  {noun:'hall', inherits:'room'},
  {noun:'staircase', inherits:'room'},
  {noun:'landing', inherits:'room'},
  {noun:'church', inherits:'room', reverb:'church'},

  { noun:'garden', inherits:'space'},
  { noun:'street', inherits:'space',
    extend(e) {
      e.sizeInFootsteps = Math.floor(Math.random()*16 + 8)
    },
    reverb:'street'
  },
  {noun:'cemetery', inherits:'garden', reverb:'forest'},
]
