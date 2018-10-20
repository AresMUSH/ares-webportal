module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
      browser: true,
      jquery: true

  },
  rules: {
      'no-console': 'off'
  },
  "globals": {
      "aresconfig": false,
      "aresweb_version": false,
      "ansi_up": false,
      "Ember": false,
      "moment": false,
      "ace": false,
      "alertify": false
      }
};
