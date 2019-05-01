module.exports = {
  plant: plant => plant.be_a('thing'),

  tree: tree => tree.be_a('plant'),
  london_plane: tree => tree.be_a('tree'),
}
