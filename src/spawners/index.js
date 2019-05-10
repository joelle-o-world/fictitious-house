const {EntitySpawner} = require('english-io')
const randomName = require('random-name')


const RandomPerson = new EntitySpawner({
  template: 'random person',
  construct() {
    let person = this.dictionary.createEntity()

    if(Math.random() < 0.5)
      person.be_a('woman')
    else
      person.be_a('man')

    let name = randomName.first() + ' ' + randomName.last()
    this.dictionary.S('BeCalled', person, name).start()
    return person
  },
})

module.exports = [RandomPerson]
