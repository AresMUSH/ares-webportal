import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    ajax: service(),
    flashMessages: service(),
    
    actions: {
        
        save() {
            let aj = this.get('ajax');
            let disabled = this.get('model').filter(p => !p.selected).map(p => p.name);
            aj.requestOne('savePlugins', { disabled_plugins: disabled }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                
                this.transitionToRoute('setup');
                this.get('flashMessages').success('Plugins updated!');
            });
        }
    }
});