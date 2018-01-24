import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webclient/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    ajax: service(),
    confirmDelete: false,
    
    actions: {        
        delete: function() {
            let aj = this.get('ajax');
            this.set('confirmDelete', false);
            aj.queryOne('deleteFile', { 
                name: this.get('model.name'),
                folder: this.get('model.folder')
             })
            .then( (response) => {
                if (response.error) {
                    return;
                }
            this.transitionToRoute('files');
            this.get('flashMessages').success('File deleted!');
            });
        }
    }
});