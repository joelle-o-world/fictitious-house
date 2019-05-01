module.exports = {
  animal: entity => entity.be_a('thing').allowLocationType('IN', 'ON', 'hold'),

  octopus: entity => entity.be_a('animal'),
  dolphin: entity => entity.be_a('animal'),
  goose: entity => entity.be_a('animal'),
  mule: entity => entity.be_a('animal')
}
