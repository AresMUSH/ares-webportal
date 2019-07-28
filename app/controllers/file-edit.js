import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    
    actions: {        
        save: function() {
            let api = this.gameApi;
            api.requestOne('updateFile', { 
                name: this.get('model.name'),
                folder: this.get('model.folder'),
                new_name: this.get('model.new_name'),
                new_folder: this.get('model.new_folder')
             }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('file', response.folder, response.name );
            this.flashMessages.success('File saved!');
            });
        }
    }
});