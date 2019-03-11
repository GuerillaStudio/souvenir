module.exports = {
  'env': {
    'es6': true,
    'node': true
  },
  'extends': [
    'standard',
    'plugin:vue/essential'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'plugins': [
    'vue'
  ],
  'rules': {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/html-end-tags': 'error',
    'vue/html-indent': [
      'error',
      2
    ],
    'vue/require-prop-types': 'error',
    'vue/attributes-order': 'error',
    'vue/attribute-hyphenation': [
      'error',
      'always'
    ],
    'vue/html-quotes': [
      'error',
      'double'
    ]

  }
}
