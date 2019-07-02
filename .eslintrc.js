module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
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
      'no-console': 'off'
    },
      
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'lib/*/index.js',
        'server/**/*.js'
      ],
    
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      }
   
    }]
};
