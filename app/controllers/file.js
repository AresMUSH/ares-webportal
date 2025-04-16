import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import ConfirmAction from 'ares-webportal/mixins/confirm-action';

export default Controller.extend(AuthenticatedController, ConfirmAction, {
  gameApi: service(),
  router: service(),
  router: service(),
  flashMessages: service(),
    
  resetOnExit: function() {
    this.hideActionConfirmation();
  },
  
  @action    
  delete() {
    let api = this.gameApi;
    this.hideActionConfirmation();
    api.requestOne('deleteFile', 
    { 
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
});