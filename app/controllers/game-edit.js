import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    router: service(),
    flashMessages: service(),
  
    warning: '',
    
    actions: {
        categoryChanged(val) {
            this.set('model.config.category', val);
        },
        statusChanged(val) {
            this.set('model.config.status', val);
        },
        save() {
            let api = this.gameApi;
            api.requestOne('saveGame', { config: this.get('model.config') }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                
                if (response.warning) {
                  this.set('warning', response.warning);
                }
        
            this.flashMessages.success('Config saved!');
            this.router.transitionTo('setup');
            });  
        }
    }
});