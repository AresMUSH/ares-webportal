import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    gameSocket: service(),
    newActivity: false,
    
    onSceneActivity: function(msg) {
        let splitMsg = msg.split('|');
        let sceneId = splitMsg[0];

        this.get('model').forEach(s => {
          if (s.id === sceneId) {
            s.set('is_unread', true);
          }
        });   
    },
    
    resetOnExit: function() {
        this.set('newActivity', false);
    },
    
    setupCallback: function() {
        let self = this;
        this.get('gameSocket').set('sceneCallback', function(data) {
            self.onSceneActivity(data) } );
    },
    
    actions: {
        
        refresh() {
            this.set('newActivity', false);
            this.send('reloadModel');
        },
        
        stopWatching(id) {
          let api = this.get('gameApi');
          api.requestOne('unwatchScene', { id: id }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.get('flashMessages').success('You are no longer watching that scene.');
              this.send('reloadModel'); 
          });
        }
    }
});