import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    router: service(),
    
    actions: {
        
        save() {
            let api = this.gameApi;
            let disabled = this.model.filter(p => !p.selected).map(p => p.name);
            api.requestOne('savePlugins', { disabled_plugins: disabled }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                
                this.router.transitionTo('setup');
                this.flashMessages.success('Plugins updated!');
            });
        }
    }
});