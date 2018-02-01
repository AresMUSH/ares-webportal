import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
    showUpload: false,
    
    actions: {        
        uploaded: function() {
            this.send('reloadModel');
        }
    }
});