import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    bootTarget: null,
    bootReason: null,
  
    actions: {
        bootPlayer: function(char) {
          let api = this.gameApi;
          let name = this.get('bootTarget.name');
          let reason = this.get('bootReason');
          
          this.set('bootTarget', null);
          this.set('bootReason', null);
          
          api.requestOne('bootPlayer', {
             name: name,
             reason: reason }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.flashMessages.success("Player booted! The adnims have been notified. It may take a minute for their status to update, but they are now in timeout.");
          });
        }
    }
});

