module.exports = [
  {
    noun:'room',
    inherits:'thing',
    extend(e) {
      e.allowLocatingType('IN')
      e.sizeInFootsteps = Math.floor(Math.random()*10 + 4)
    },
  },
  {
    noun:'space',
    inherits:'thing',
    extend(e) {
      e.allowLocatingType('IN')
      e.sizeInFootsteps = Math.floor(Math.random()*10 + 4)
    },
  },

  {noun:'kitchen', inherits:'room'},
  {noun:'bathroom', inherits:'room'},
  {noun:'living room', inherits:'room'},
  {noun:'bedroom', inherits:'room'},
  {noun:'corridor', inherits:'room'},
  {noun:'hallway', inherits:'room'},
  {noun:'hall', inherits:'room'},
  {noun:'staircase', inherits:'room'},
  {noun:'landing', inherits:'room'},

  {
    noun:'garden',
    inherits:'space',
  },
  {noun:'street', inherits:'space'},
  {noun:'cemetery', inherits:'space'},
]
