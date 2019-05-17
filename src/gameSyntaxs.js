const {SpecialSyntax, sub} = require('english-io')

let WhereIs = new SpecialSyntax('where is _')
WhereIs.exec = function([NP], domain) {
  let e = NP.findFirst(domain)
  if(!e)
    return null
  console.log(e)
  if(e.locationType == 'IN')
    return sub('_ is in _', e, e.location)
  else if(e.locationType == 'ON')
    return sub('_ is on _', e, e.location)
  else
    console.warn('Unhandled "Where" question')
}

module.exports = [
  WhereIs,
]
