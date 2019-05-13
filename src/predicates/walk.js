const {Predicate, S, sub} = require('english-io')
const SoundPredicate = require('../sound/SoundPredicate')
const FolieSound = require('../sound/FolieSound')
const getAccessibleLocations = require('../logistics/getAccessibleLocations')

const WalkThrough = new Predicate({
  forms: [
    {verb: 'walk', params:['subject', 'through']},
    {verb: 'pass', params:['subject', 'through']},
    {verb: 'go', params:['subject', 'through']},
    {verb: 'cross', params:['subject', 'object']},
  ],
  actionable: false,
  expand(subject, container) {
    let feet = subject.findWithin('a foot')
    let nSteps = container.sizeInFootsteps
    let sentences = []
    for(let i=0; i<nSteps; i++) {
      let foot = feet[i%feet.length]
      sentences.push(S(Step, foot))
    }
    return sentences
  },
  problem(subject, container) {
    if(!subject.is_a('thing'))
      return sub('_ is not a physical entity', subject)
    if(!container.is_a('thing'))
      return sub('_ is not a physical entity', container)

    if(!subject.location)
      return sub('_ is nowhere', subject)

    if(subject.location == container && subject.locationType == 'IN')
      return null

    let accessibleLocations = [...getAccessibleLocations(subject.location)]
    if(!accessibleLocations.some(
      ({location, locationType}) => locationType == 'IN' && location == container
    ))
      return sub('_ is too far away', container)
  },
  begin(person, container) {
    person.setLocation(container, 'IN')
  },
  //until: callback => callback(),
})

const WalkAcross = new Predicate({
  forms: [
    {verb: 'walk', params:['subject', 'across']},
    {verb: 'go', params:['subject', 'across']},
    {verb: 'pass', params:['subject', 'over']},
    {verb: 'cross', params:['subject', 'object']}
  ],
  actionable: false,

  expand(subject, container) {
    let feet = subject.findWithin('a foot')
    let nSteps = container.sizeInFootsteps
    let sentences = []
    for(let i=0; i<nSteps; i++) {
      let foot = feet[i%feet.length]
      sentences.push(S(Step, foot))
    }
    return sentences
  },

  problem(subject, container) {
    if(!subject.location)
      return sub('_ is nowhere', subject)

    if(subject.location == container && subject.locationType == 'ON')
      return null

    let accessibleLocations = [...getAccessibleLocations(subject.location)]
    if(!accessibleLocations.some(
      ({location, locationType}) => locationType == 'IN' && location == container
    ))
      return sub('_ is too far away', container)
  },
  begin(person, container) {
    person.setLocation(container, 'ON')
  },
  //until: callback => callback(),
})

const Step = new SoundPredicate({
  forms: [
    {verb:'step',},
    {verb:'take a step'},
    {verb:'put one foot in front of the other'}
  ],
  sound: () => new FolieSound('footstep')
})

module.exports.WalkThrough = WalkThrough
module.exports.WalkAcross = WalkAcross
module.exports.Step = Step
