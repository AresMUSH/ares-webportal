import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({    
    ajax: service(),
    flashMessages: service(),
    
    actions: {
        
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