const Promise = require('bluebird')

const folieIndex = require('../../folie/index.json')
const folieBuffers = {}
let nBuffers = 0

async function getFolie(type) {
  let choices = folieIndex[type]
  let audioPath = choices[Math.floor(Math.random()*choices.length)]

  if(folieBuffers[audioPath])
    return folieBuffers[audioPath]
  else {
    var request = new XMLHttpRequest();
    request.open('GET', audioPath, true);
    request.responseType = 'arraybuffer';

    let promise = new Promise((fulfil, reject) => {
      // Decode asynchronously
      request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
          // got the buffer
          folieBuffers[audio] = buffer
          fulfil(buffer)
        }, reject);
      }
    })
    folieBuffers[audioPath] = promise
    request.send()

    nBuffers++
  }
}
module.exports = getFolie
