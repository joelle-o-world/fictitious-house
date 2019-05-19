const Story = require('../Story')

module.exports = [
  require('./Cadiz Street.json'),
].map(s => new Story(s))
