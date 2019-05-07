const Promise = require('bluebird')
const {resolve} = require('path')

const folieURL = '../../folie/'

const folieIndex = require('../../folie/index.json')
const folieBuffers = {}
let nBuffers = 0

const context = new AudioContext

async function getFolie(type) {
  let choices = folieIndex[type]
  let audioPath = resolve(
    folieURL,
    choices[Math.floor(Math.random()*choices.length)]
  )

  if(folieBuffers[audioPath])
    return folieBuffers[audioPath]
  else {
    var request = new XMLHttpRequest();
    request.open('GET', audioPath, true);
    request.responseType = 'arraybuffer';

    let promise = new Promise((fulfil, reject) => {
      // Decode asynchronously
      request.onload = function() {
        console.log(request.response)
        context.decodeAudioData(request.response, function(buffer) {
          // got the buffer
          folieBuffers[audioPath] = buffer
          fulfil(buffer)
        }, reject);
      }
    })
    folieBuffers[audioPath] = promise
    request.send()

    nBuffers++
    return promise
  }
}
module.exports = getFolie
