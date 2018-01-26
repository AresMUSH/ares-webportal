import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import JsYaml from "npm:js-yaml";

export default Controller.extend({    
    ajax: service(),
    flashMessages: service(),
    
    actions: {
        
        textChanged(evt, warning) {
            try {
                let yaml = JsYaml.safeLoad(evt.target.value);
            }
            catch(error) {
               this.get('flashMessages').warning(`There may be a problem with your configuration YAML text: ${error.reason}.`) 
                Ember.set(warning, `There may be a problem with your configuration YAML text: ${error.reason}.`);
            }
            
        },
        
        save() {
            let aj = this.get('ajax');
            let modelConfig = this.get('model.config');
            let config = {};
            
            Object.keys(modelConfig).forEach( function(k) {
                config[k] = modelConfig[k].new_value;
            });

            aj.queryOne('saveConfig', { file: this.get('model.file'), config: config }, null)
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