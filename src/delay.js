function delay(seconds, callback) {
  setTimeout(callback, seconds*1000)
}
module.exports = delay

function interval(seconds, callback) {
  setInterval(callback, seconds*1000)
}
module.exports.interval = interval
