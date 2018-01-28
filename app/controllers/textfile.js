import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({    
    ajax: service(),
    
    actions: {
        
        save() {
            let aj = this.get('ajax');


            aj.requestOne('saveTextFile', { file: this.get('model.file'), file_type: this.get('model.file_type'), text: this.get('model.text') }, null)
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