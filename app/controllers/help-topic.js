import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import ConfirmAction from 'ares-webportal/mixins/confirm-action';

export default Controller.extend(AuthenticatedController, ConfirmAction, {
  gameApi: service(),
  confirmRestore: false,
  flashMessages: service(),

  resetOnExit: function() {
    this.hideActionConfirmation();
  },
    
  @action
  restore() {
    let api = this.gameApi;
    this.hideActionConfirmation();
    api.requestOne('restoreHelp',
    { 
      topic: this.get('model.key')
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.flashMessages.success('Custom help file removed!');
      this.send('reloadModel');
    });
  }
});