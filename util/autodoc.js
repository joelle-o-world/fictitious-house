const D = require('../src')
const {autodoc} = require('english-io')
const fs = require('fs')

let demos = autodoc(D)

let sections = []
for(let type in demos)
  sections.push(
    type.toUpperCase()+':',
    ...demos[type].map(s => '\t'+s)
    '\n'
  )

let txt = sections.join('\n')


fs.writeFileSync('dictionary doc.txt', txt)
