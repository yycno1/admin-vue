module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-shadow': 0,
    'no-param-reassign': 0,
    'no-console': 0,
    'linebreak-style': 0,
    'import/prefer-default-export': 0,
    'import/no-dynamic-require': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'no-continue': 0,
    'no-plusplus': 0,
    'global-require': 0,
    'func-names': 0,
  },
  'env': {
    'browser': true
  }
}
