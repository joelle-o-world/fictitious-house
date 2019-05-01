function* getAccessibleLocations(
  from, // entity.is_a('thing')
  accessible=['IN', 'ON'],
  skippable=['consist', 'wear', 'hold'],
  forbidden=[] // a set of forbidden entitys, (to stop things going inside themself)
) {
  // find which locations are accessible from a given location in one step

  // yield adjacentLocations
  for(let entity of from.adjacentLocations)
    for(let type of accessible)
      if(entity.possibleLocatingTypes.includes(type))
        yield {location:entity, locationType: type}

  // search down the tree
  let down = searchDown(from, accessible, skippable)
  if(down)
    yield down

  // search up the tree
  for(let entity of from.locating) {
    if(forbidden.includes(entity))
      continue
    //if(skippable.includes(entity.locationType))
    for(let result of searchUp(entity, accessible, skippable))
        yield result
  }
}
module.exports = getAccessibleLocations

function searchDown(from, accessible, skippable) {
  // search down the tree
  let loc = from
  while(loc && skippable.includes(loc.locationType))
    loc = loc.location
  if(loc && accessible.includes(loc.locationType) && loc.open)
    return {location: loc.location, locationType:loc.locationType}
  else
    return null
}

function* searchUp(from, accessible, skippable) {
  if(!from.locating)
    return

  for(let type of accessible)
    if(from.possibleLocatingTypes.includes(type))
      yield {location:from, locationType:type}
  for(let entity of from.locating) {
    if(skippable.includes(entity.locationType))
      for(let result of searchUp(entity, accessible, skippable))
        yield result
  }
}

function permittedMoves(entity) {
  if(entity.location)
    return getAccessibleLocations(entity.location, undefined, undefined, [entity])
  else return []
}
module.exports.permittedMoves = permittedMoves
