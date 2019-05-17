module.exports = [
  { noun: 'item',
    inherits:'thing',
    extend: e => e.allowLocationType('IN', 'hold', 'ON'),
  },

  // MISC
  {noun:'doorknob', inherits:'thing'},
  {noun:'cigarette', inherits:'item'},
  {noun:'filter', inherits:'item'},
  {noun:'tobacco', inherits:'item'},
  {noun:'rizla', inherits:'item'},
  {noun:'computer', inherits:'item'},
  {noun:'salmon wrap', inherits:'item'},
  {noun:'bicycle', inherits:'item'},
  {noun:'handlebars', inherits:'item'},
  {noun:'bicycle frame', inherits:'item'},
  {noun:'wheel', inherits:'item'},
  {noun:'oven', inherits:'item', extend: e => e.allowLocatingType('IN')},
  {noun:'piece of furniture', inherits:'item'},
  {noun:'shower', inherits:'piece of furniture'},
  {noun:'toilet', inherits:'piece of furniture'},
  {noun:'sink', inherits:'piece of furniture'},


  // CHAIRS
  { noun: 'chair',
    inherits:'piece of furniture',
    extend: e => e.allowLocatingType('SEAT', 'ON'),
  },
  { noun: 'armchair', inherits:'chair'},
  { noun: 'sofa', inherits:'chair'},

  // TABLES
  {noun:'table', inherits:'piece of furniture', extend: e => e.allowLocatingType('ON')},
  {noun:'desk', inherits:'table'},
  {noun:'nightstand', inherits:'table'},

  // BED
  {noun: 'bed', inherits:'piece of furniture', extend: e => e.allowLocatingType('ON', 'SIT')},

  // CUPBOARD/BOX
  {
    noun: 'cupboard',
    inherits:'piece of furniture',
    extend: e=>e.allowLocatingType('IN')
  },
  {noun: 'fridge', inherits:'cupboard', modusOperandi:'make a buzzing sound'},
  {noun:'drawer', inherits:'thing', extend:e=>e.allowLocatingType('thing')},
  {noun:'wardrobe', inherits:'cupboard'},
  {noun:'box', inherits:'item', extend: e=>e.allowLocatingType('IN')},
]
