const { injectBabelPlugin } = require('react-app-rewired');

module.exports = function override(config) {
  config = injectBabelPlugin(['styled-jsx/babel'], config)

  return config
};