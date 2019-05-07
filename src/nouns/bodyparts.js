let bodyPart = {
  noun:'body part',
  inherits: 'thing',
  extend: e => e.allowLocatingType('consist', 'ON')
                .allowLocationType('consist', 'hold', 'IN', 'ON')
}

let body_parts = [
  'body', 'arm', 'elbow', 'forearm', 'bicep', 'hand',
  'palm', 'knuckle', 'finger', 'thumb',
  'sole', 'toe', 'toenail', 'fingerprint', 'fingernail',
  'leg', 'thigh', 'knee', 'ankle', 'shin', 'foot',
  'head', 'eye', 'nose', 'ear', 'hair', 'mouth',
  'torso',
  'neck',
  'eyelash', 'eyebrow', 'pupil',
  'lip', 'tooth',
]

module.exports = [
  bodyPart,
  ...body_parts.map(noun => ({noun:noun, inherits:'body part'}))
]
