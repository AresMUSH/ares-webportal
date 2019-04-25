import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({    
    gameApi: service(),
    flashMessages: service(),
    newConfigKey: '',
    configChanged: false,
    confirmRestore: null,
    
    config: function() {
        return this.get('model.config');
    }.property('model.config', 'configChanged'),
    
    resetOnExit: function() {
        this.set('newConfigKey', '');
        this.set('confirmRestore', null);
    },
    
    actions: {
        
        addNew() {
            let key = this.get('newConfigKey');
            let modelConfig = this.get('model.config');
            if (modelConfig[key]) {
                return;
            }
            modelConfig[key] = { key: key, lines: 3, value: '', new_value: '' };
            this.set('model.config', modelConfig);
            this.set('configChanged', !this.get('configChanged'));
        },
        
        removeKey(key) {
            let modelConfig = this.get('model.config');
            delete modelConfig[key];
            this.set('model.config', modelConfig);
            this.set('configChanged', !this.get('configChanged'));
        },
        
        restoreDefaults() {
          let api = this.get('gameApi');
          api.requestOne('restoreConfig', { file: this.get('model.file') }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
      
          this.get('flashMessages').success('Config restored!');
          this.send('reloadModel');
          });  
        },
        
        save() {
            let api = this.get('gameApi');
            let modelConfig = this.get('model.config');
            let config = {};
            
            Object.keys(modelConfig).forEach( function(k) {
                config[k] = modelConfig[k].new_value;
            });

            api.requestOne('saveConfig', { file: this.get('model.file'), config: config }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
        
            this.get('flashMessages').success('Config saved!');
            this.transitionToRoute('setup');
            });  
        }
        
    }
});