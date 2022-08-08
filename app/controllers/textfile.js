import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {    
    gameApi: service(),
    router: service(),
    flashMessages: service(),
    resetEditor: null,  // This will be set to a function by the component binding.  We can call that function to reset the editor text.
    
    actions: {
        editorChanged: function(text) {
          this.set('model.text', text);
        },
        
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
            else if (file_type == 'code') {
              this.flashMessages.success('File saved! You will need to reload or redploy the plugin/portal for the changes to take effect.');
              this.router.transitionTo('setup');  
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