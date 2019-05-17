module.exports = [
  {
    noun:'food',
    inherits:'thing',
    extend: e => e.allowLocationType('IN', 'ON', 'hold'),
  },
  {noun:'sausage', inherits:'food'}
]
