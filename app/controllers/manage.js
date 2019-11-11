import $ from "jquery"
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({    
    gameApi: service(),
    gameSocket: service(),
    flashMessages: service(),
    status: '',

    resetOnExit: function() {
      this.set('status', '');
    },

    onManageActivity: function(type, msg /* , timestamp */ ) {
      this.addToStatus(msg);
    },
    
    setupCallback: function() {
      let self = this;
      this.set('status', '');
      this.gameSocket.setupCallback('manage_activity', function(type, msg, timestamp) {
          self.onManageActivity(type, msg, timestamp) } );
    },
    
    addToStatus: function(message) {
      let old_status = this.status;
      this.set('status', `${old_status}\n${message}`);
      
      try {
        $('#manageLog').stop().animate({
            scrollTop: $('#manageLog')[0].scrollHeight
        }, 800); 
      }
      catch(error) {
        // This happens sometimes when transitioning away from screen.
      }   
    },
      
    actions: {
        deploy() {
          let api = this.gameApi;
          this.set('status', '');
          this.addToStatus('Website redeploying.  Please wait.');

          api.requestOne('deployWebsite', null)
            .then( (response) => {
              this.addToStatus(response.message);
          });  
        },
        
        returnToManage() {
          this.set('status', '');
        },
        
        shutdown() {
            let api = this.gameApi;

            this.set('status', '');
            api.requestOne('shutdown')
            .then( (response) => {
                if (response.error) {
                    return;
                }
        
            this.transitionToRoute('shutdown');
            });  
        },
        
        upgrade() {
          let api = this.gameApi;
          this.set('status', '');
          this.addToStatus('Starting upgrade.  Please wait.');
          api.requestOne('upgrade', null)
            .then( (response) => {
              this.addToStatus(response.message);
          });
        }
        
    }
});