const Promise = require('bluebird')
const {resolve} = require('path')

const irURL = '../fictitious-house/impulse-response'

const irIndex = require('../../impulse-response/index.json')

const irBuffers = {}
let nBuffers = 0

const audioContext = new AudioContext

function getImpulseResponse(type) {
  let choices = irIndex[type]
  let audioPath = resolve(
    irURL,
    choices[Math.floor(Math.random()*choices.length)]
  )

  if(irBuffers[audioPath])
    return irBuffers[audioPath]
  else {
    let request = new XMLHttpRequest()
    request.open('GET', audioPath, true)
    request.responseType = 'arraybuffer'

    let promise = new Promise((fulfil, reject) => {
      request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
          // got the buffer
          fulfil(buffer)
        }, reject);
      }
    })
    irBuffers[audioPath] = promise
    request.send()

    nBuffers++
    return promise
  }
}
module.exports = getImpulseResponse
