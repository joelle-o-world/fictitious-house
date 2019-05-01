module.exports = {
  garment: entity => entity.be_a('thing').allowLocationType('wear', 'IN', 'ON'),
  shirt: entity => entity.be_a('garment'),
  "pair of trousers": entity => entity.be_a('garment'),
  skirt: entity => entity.be_a('garment'),
  "t-shirt": entity => entity.be_a('garment'),
  hat: entity => entity.be_a('garment'),
  pants: entity => entity.be_a('garment'),
  shoe: entity => entity.be_a('garment'),
  sock: entity => entity.be_a('garment'),
}
