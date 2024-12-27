import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  router: service(),
    
  @action
  startCombat() {
    let api = this.gameApi;
    api.requestOne('startCombat')
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.flashMessages.success('Combat started!');
      this.router.transitionTo('combat', response.id);
    });
  }
});