/*
  Produce an index of the folie directory. Plop it in folie/index.js.
*/

const { lstatSync, readdirSync, writeFileSync } = require('fs')
const { join, basename, relative } = require('path')
const findFiles = require('./findFiles')

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory)

const dirs = getDirectories('./impulse-response')


let index = {}
for(let dir of dirs) {
  let files = findFiles(dir, ['.mp3', '.wav'])
    .map(file => relative('./impulse-response', file))
  index[basename(dir)] = files
}


writeFileSync('./impulse-response/index.json', JSON.stringify(index, undefined, 2))
console.log('Indexed impulse-response/ directory.')
