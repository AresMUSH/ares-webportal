import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    router: service(),
    router: service(),
    flashMessages: service(),
    confirmDelete: false,
    
    actions: {        
        delete: function() {
            let api = this.gameApi;
            this.set('confirmDelete', false);
            api.requestOne('deleteFile', { 
                name: this.get('model.name'),
                folder: this.get('model.folder')
             })
            .then( (response) => {
                if (response.error) {
                    return;
                }
            this.router.transitionTo('files');
            this.flashMessages.success('File deleted!');
            });
        }
    }
});