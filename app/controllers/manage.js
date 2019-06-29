import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({    
    gameApi: service(),
    flashMessages: service(),
    deployMessage: null,
    upgradeMessage: null,

    resetOnExit: function() {
      this.set('deployMessage', null);
      this.set('upgradeMessage', null);
    },
  
    actions: {
        deploy() {
            let api = this.get('gameApi');

            api.requestOne('deployWebsite')
            .then( (response) => {
                if (response.error) {
                    return;
                }
            this.set('deployMessage', 'Website redeploying.  Please wait a minute and then refresh your browser window to see the changes.  Check the game log file for any error messages.');
          });  
        },
        
        shutdown() {
            let api = this.get('gameApi');


            api.requestOne('shutdown')
            .then( (response) => {
                if (response.error) {
                    return;
                }
        
            this.transitionToRoute('shutdown');
            });  
        },
        
        upgrade() {
            let api = this.get('gameApi');


            api.requestOne('upgrade')
            .then( (response) => {
                if (response.error) {
                    return;
                }
                if (response.restart_required) {
                  this.set('upgradeMessage', "This upgrade requires a game restart. Shutdown and restart the game to complete the upgrade. See the 'restarting the game' tutorial on aresmush.com for help.")
                } else {
                  this.set('upgradeMessage', 'Upgrade complete.  Please wait a minute and then refresh your browser window to see the changes.  Check the game log file for any error messages.')
                }
            
            
            });  
        }
        
    }
});