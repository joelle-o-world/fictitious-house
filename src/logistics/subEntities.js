function *subEntities(bigEntity) {
  let list = [...bigEntity.locating]

  for(let i=0; i<list.length; i++) {
    yield list[i]
    list.push(...list[i].locating)
  }
}
module.exports = subEntities
