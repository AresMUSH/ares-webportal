'use strict';

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      ],
    },
  },
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
  ],
  
  env: {
      browser: true,
      jquery: true
  },
  
  "globals": {

      "aresconfig": false,
      "aresweb_version": false,
      "ansi_up": false,
      "Ember": false,
      "moment": false,
      "ace": false,
      "alertify": false
      },
    plugins: ['ember'],
    rules: {
      'no-console': 'off',
      'ember/no-new-mixins': 'off',
      'ember/jquery-ember-run': 'off',
      'ember/no-observers': 'off',
      'ember/no-jquery': 'error'
    },
      
  overrides: [
    // node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.stylelintrc.js',
        './.template-lintrc.js',
        './ember-cli-build.js',
        './testem.js',
        './blueprints/*/index.js',
        './config/**/*.js',
        './lib/*/index.js',
        './server/**/*.js',
      ],
    
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      extends: ['plugin:n/recommended'],
    },
      // Test files:
  ],
};
