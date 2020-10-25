const babelconfig = require('./babelconfig.js');

module.exports = {
  transform: { '^.+\\.js$': ['babel-jest', babelconfig.server] },
  testPathIgnorePatterns: ['fixtures'],
};
