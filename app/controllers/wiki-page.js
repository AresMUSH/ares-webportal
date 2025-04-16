import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import ConfirmAction from 'ares-webportal/mixins/confirm-action';

export default Controller.extend(AuthenticatedController, ConfirmAction, {
  gameApi: service(),
  router: service(),
  
  resetOnExit: function() {
    this.hideActionConfirmation();
  },
  
  @action
  delete() {
    let api = this.gameApi;
    this.hideActionConfirmation();
    api.requestOne('deleteWiki', { id: this.get('model.id')})
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('wiki');
      this.flashMessages.success('Page deleted!');
    });
  }
});