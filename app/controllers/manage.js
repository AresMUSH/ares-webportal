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

    setupCallback: function() {
      let self = this;
      this.set('status', '');
      this.get('gameSocket').set('manageCallback', function(data, notification_type) {
        self.addToStatus(data) } );
    },
    
    addToStatus: function(message) {
      let old_status = this.get('status');
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
          let api = this.get('gameApi');
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
            let api = this.get('gameApi');

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
          let api = this.get('gameApi');
          this.set('status', '');
          this.addToStatus('Starting upgrade.  Please wait.');
          api.requestOne('upgrade', null)
            .then( (response) => {
              this.addToStatus(response.message);
          });
        }
        
    }
});