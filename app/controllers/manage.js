import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({    
    ajax: service(),
    
    actions: {
        
        shutdown() {
            let aj = this.get('ajax');


            aj.queryOne('shutdown')
            .then( (response) => {
                if (response.error) {
                    return;
                }
        
            this.transitionToRoute('shutdown');
            });  
        }
        
    }
});