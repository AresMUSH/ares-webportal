module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
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
      'ember/no-function-prototype-extensions': 'off',
      'ember/avoid-leaking-state-in-ember-objects': 'off',
      'ember/routes-segments-snake-case': 'off',
      'ember/jquery-ember-run': 'off',
      'ember/closure-actions': 'off',
      'ember/no-observers': 'off'

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
        sourceType: 'script'
      },
      env: {
        browser: false,
        node: true
      }
   
    }]
};
