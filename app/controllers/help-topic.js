import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    confirmRestore: false,

    resetOnExit: function() {
      this.set('confirmRestore', false);
    },
    
    actions: {
        restore() {
          let api = this.gameApi;
          this.set('confirmRestore', false);
          api.requestOne('restoreHelp', { 
             topic: this.get('model.key')}, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.flashMessages.success('Custom help file removed!');
              this.send('reloadModel');
          });
        }
    }
});