// eslint.config.js

module.exports = [
  {
    rules: {
      'semi': ['error', 'always'],
      'prefer-const': 'error',
      'indent': [
        'error',
        2,
        {
          'SwitchCase': 1,
        }
      ],
      'linebreak-style': [
        'error',
        'windows',
      ],
      'no-console': [
        'error',
        {
          'allow': ['log'],
        }
      ],
      'quotes': [
        'error',
        'single',
        {
          'avoidEscape': true,
        }
      ],
    }
  },
];
