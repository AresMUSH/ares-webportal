import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import ConfirmAction from 'ares-webportal/mixins/confirm-action';

export default Controller.extend(ConfirmAction, {
  gameApi: service(),
  flashMessages: service(),
  router: service(),
  confirmClaim: false,
  rosterApp: '',

  resetOnExit: function() {
    this.set('rosterApp', this.get('model.roster.app_template'));
    this.hideActionConfirmation();
  },
    
  setup: function() {
    this.set('rosterApp', this.get('model.roster.app_template'));
  },
    
  @action
  claimRoster() {
    let api = this.gameApi;
    let app = this.rosterApp;
            
    this.hideActionConfirmation();
    this.set('rosterApp', this.get('model.roster.app_template'));
            
    if (this.get('model.roster.app_required') && !app) {
      this.flashMessages.danger('App details and contact info are required.');
      return;
    }
    api.requestOne('claimRoster', { id: this.get('model.id'), app: app })
    .then( (response) => {
      if (response.error) {
        return;
      }
      if (response.password) {
        this.set('model.password', response.password);
      } else {
        this.flashMessages.success('App submitted.');
        this.router.transitionTo('roster');
      }
                
    });
  }
});