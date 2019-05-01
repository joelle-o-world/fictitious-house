module.exports = {
  happy: entity => entity,
  sad: entity => entity,
  open: entity => {
    entity.open = true
    entity.stopBeing('closed')
  },
  closed: entity => {
    entity.open = false
    entity.stopBeing('open')
  },
}
