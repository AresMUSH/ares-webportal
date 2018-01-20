import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webclient/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    ajax: service(),
    
    actions: {        
        save: function() {
            let aj = this.get('ajax');
            aj.queryOne('updateFile', { 
                path: this.get('model.path'),
                new_name: this.get('model.name'),
                new_folder: this.get('model.folder')
             }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
            this.transitionToRoute('file',                          
                          { queryParams: { path: response.path, name: response.name }});
            this.get('flashMessages').success('File saved!');
            });
        }
    }
});