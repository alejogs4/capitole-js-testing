const baseConfig = require('./src/config/base.config')

module.exports = {
  ...baseConfig,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
