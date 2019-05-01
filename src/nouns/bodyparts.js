module.exports = {
  "body part": entity => {
    entity.be_a('thing')
      .allowLocatingType('consist', 'ON')
      .allowLocationType('consist', 'hold', 'IN', 'ON')
  },
}

let body_parts = [
  'body', 'arm', 'elbow', 'forearm', 'bicep', 'hand',
  'palm', 'knuckle', 'finger', 'thumb',
  'sole', 'toe', 'nail', 'fingerprint',
  'leg', 'thigh', 'knee', 'ankle', 'shin', 'foot',
  'head', 'eye', 'nose', 'ear', 'hair', 'mouth',
  'torso',
  'neck',
  'eyelash', 'eyebrow', 'pupil',
  'lip', 'tooth',
]

for(let part of body_parts)
  module.exports[part] = entity => entity.be_a('body part')
