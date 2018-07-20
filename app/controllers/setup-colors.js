import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),
    gameSocket: service(),
    
    actions: {
        
        saveColors() {
            let api = this.get('gameApi');
            let colors = {};
            this.get('model').forEach(c => { colors[c.name] = c.value } );
            api.requestOne('saveColors', { colors: colors })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                
                this.get('flashMessages').success('Colors saved.  You will need to refresh the page for the new colors to take effect.');
                this.transitionToRoute('setup');
                
            });
        }
    }
});