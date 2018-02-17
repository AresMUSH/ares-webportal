import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({    
    ajax: service(),
    flashMessages: service(),
    
    actions: {
        deploy() {
            let aj = this.get('ajax');


            aj.requestOne('deployWebsite')
            .then( (response) => {
                if (response.error) {
                    return;
                }
            this.get('flashMessages').success('Website redeploying.  Please wait a minute and then refresh your browser window to see the changes.  Check the game log file for any error messages.');
            this.transitionToRoute('manage');
            });  
        },
        
        shutdown() {
            let aj = this.get('ajax');


            aj.requestOne('shutdown')
            .then( (response) => {
                if (response.error) {
                    return;
                }
        
            this.transitionToRoute('shutdown');
            });  
        }
        
    }
});