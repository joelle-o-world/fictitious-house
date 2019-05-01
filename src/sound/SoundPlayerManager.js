/**
 * A class for keeping track of multiple sound player objects.
 * @class SoundPlayerManager
 * @constructor
 */

class SoundPlayerManager {
  constructor(hearer) {
    /* A list of sound players */
    this.players = []

    this.hearer = hearer
  }

  get hearer() {
    return this._hearer
  }
  set hearer(entity) {
    this._hearer = entity
  }
}

/* Get a list of all containers audible from a given hearer entity */
function findContainers(hearer, ) {
  // get hearers container
  let hearerContainer = hearer.container

  // find sub-containers
  let subContainers = []
  let list = [...hearerContainer.locating]
  for(let i=0; i<list.length; i++) {
    let entity = list[i]
    if(entity.possibleLocatingTypes.includes('IN'))
      // its a container!
      subContainers.push(entity)
    for(let subEntity of entity.locating)
      if(subEntity.locationType != 'IN')
        list.push(subEntity)
  }
}
