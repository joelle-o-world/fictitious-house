/* Get the container of any entity */
function getContainer(entity) {
  // Recursively, search down the location tree to find the first `IN`
  // location.
  if(entity.locationType == 'IN')
    return entity.location
  else if(entity.location)
    return entity.location.container
  else
    return null
}
module.exports = getContainer

function explore(centre, recursiveDepth=1) {
  let subcontainers = getSubcontainers(centre)
  let supercontainer = getContainer(centre)

  let list = [...subcontainers]
  if(supercontainer)
    list.push(supercontainer)

  let foundByRecursion = []
  if(recursiveDepth)
    for(let item of list)
      foundByRecursion.push(
        ...explore(item, recursiveDepth-1).filter(
          entity => !list.includes(entity) && !foundByRecursion.includes(entity)
        )
      )

  list.push(...foundByRecursion)

  return list
}
module.exports.explore = explore

/* Get a list of all the containers that exist within a given container entity */
function getSubcontainers(entity) {
  let subcontainers = []
  let list = [...entity.locating]
  for(let i=0; i<list.length; i++) {
    let entity = list[i]
    if(entity.possibleLocatingTypes.includes('IN'))
      // its a container!
      subcontainers.push(entity)
    for(let subEntity of entity.locating)
      if(subEntity.locationType != 'IN')
        list.push(subEntity)
  }

  return subcontainers
}
module.exports.getSubcontainers = getSubcontainers
