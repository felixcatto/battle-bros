const path = require('path');

module.exports = {
  env: {
    node: true,
    browser: true,
    jest: true,
  },

  parser: '@babel/eslint-parser',
  parserOptions: {
    babelOptions: { configFile: path.resolve(__dirname, '.eslint.babel.js') },
  },

  extends: ['airbnb-base', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],

  ignorePatterns: ['/dist'],

  settings: { react: { version: '16.13.1' } },

  rules: {
    // # Formatting done by Prettier
    'function-paren-newline': 0,
    'no-confusing-arrow': 0,
    'implicit-arrow-linebreak': 0,
    'object-curly-newline': 0,
    'operator-linebreak': 0,
    indent: 0,
    'comma-dangle': 0,
    // # END
    'consistent-return': 0,
    'import/prefer-default-export': 0,
    'no-console': 1,
    'arrow-parens': ['error', 'as-needed'],
    'no-param-reassign': ['error', { props: false }],
    'no-return-assign': ['error', 'except-parens'],
    'max-len': ['error', { ignoreComments: true, code: 100 }],
    'react/prop-types': 0,
    'react/display-name': 1,
  },
};
