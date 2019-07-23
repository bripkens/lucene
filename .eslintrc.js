module.exports = {
  parser: 'babel-eslint',
  extends: 'eslint:recommended',
  env: {
    node: true
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-useless-escape': 0
  }
};
