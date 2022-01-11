import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {    
    gameApi: service(),
    router: service(),
    
    actions: {
        
        save() {
            let api = this.gameApi;
            let file_type = this.get('model.file_type');

            api.requestOne('saveTextFile', { file: this.get('model.file'), file_type: file_type, text: this.get('model.text') }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
        
            if (file_type == 'style') {
              this.flashMessages.success('Config saved!  You will need to refresh the page for the new styles to take effect.');
            }
            else {
              this.flashMessages.success('Config saved! You may need to refresh the page to see the changes.');
              if (this.isWikiMgr) {
                this.router.transitionTo('home');
              } else {
                this.router.transitionTo('setup');  
              }
            }
            
            });  
        }
        
    }
});