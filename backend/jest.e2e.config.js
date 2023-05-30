const baseConfig = require('./src/config/base.config')

module.exports = {
  ...baseConfig,
  testRegex: 'src/.*\\.e2e\\.ts$',
}