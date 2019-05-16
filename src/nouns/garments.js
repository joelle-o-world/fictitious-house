module.exports = [
  { noun:'garment',
    inherits:'thing',
    extend: e=>e.allowLocationType('wear', 'IN', 'ON', 'hold')
  },

  { noun: 'shirt', inherits:'garment'},
  { noun: 'pair of trousers', inherits:'garment'},
  { noun: 'skirt', inherits:'garment'},
  { noun: 't-shirt', inherits:'garment'},
  { noun: 'hat', inherits:'garment'},
  { noun: 'pants', inherits:'garment'},
  { noun: 'shoe', inherits:'garment'},
  { noun: 'sock', inherits:'garment'},
]
