import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    confirmClaim: null,
    rosterApp: '',

    resetOnExit: function() {
      this.set('confirmClaim', null);
      this.set('rosterApp', this.get('model.roster.app_template'));
    },
    
    setup: function() {
      this.set('rosterApp', this.get('model.roster.app_template'));
    },
    
    actions: {
        claimRoster() {
            let api = this.gameApi;
            let app = this.rosterApp;
            
            this.set('confirmClaim', null);
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
                  this.transitionToRoute('roster');
                }
                
            });
        }
    }
});