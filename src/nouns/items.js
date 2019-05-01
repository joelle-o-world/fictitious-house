module.exports = {
  item: item => {
    item.be_a('thing')
      .allowLocationType('IN', 'hold', 'ON')
  },

  chair: item => item.be_a('item').allowLocatingType('seat'),
  armchair: item => item.be_a('chair'),
  sofa: item => item.be_a('chair'),

  table: item => item.be_a('item').allowLocatingType('ON'),
  desk: item =>item.be_a('table'),
  nightstand: item => item.be_a('table'),

  bed: item => item.be_a('item').allowLocatingType('ON'),

  cupboard: item => item.be_a('item').allowLocatingType('IN'),
  drawer: item => item.be_a('thing').allowLocatingType('IN'),
  doorknob: item => item.be_a('thing'),
  wardrobe: item => item.be_a('cupboard'),

  box: item => item.be_a('item').allowLocatingType('IN'),

  cigarette: item => item.be_a('item'),
  filter: item => item.be_a('item'),
  tobacco: item => item.be_a('item'),
  rizla: item => item.be_a('item'),
  computer: item => item.be_a('item'),
  "salmon wrap": item => item.be_a('item'),
}
