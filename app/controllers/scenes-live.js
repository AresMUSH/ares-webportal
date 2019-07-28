import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    gameSocket: service(),
    newActivity: false,
    
    onSceneActivity: function(type, msg, timestamp) {
        let splitMsg = msg.split('|');
        let sceneId = splitMsg[0];
        let lastPosed = splitMsg[1];

        let model = this.get('model.active');
        model.forEach((s, i) => {
          if (s.id === sceneId) {
            this.set(`model.active.${i}.is_unread`, true);
            this.set(`model.active.${i}.updated`, timestamp);
            this.set(`model.active.${i}.last_posed`, lastPosed);
          }
        });   
    },
    
    resetOnExit: function() {
        this.set('newActivity', false);
    },
    
    setupCallback: function() {
        let self = this;
        this.gameSocket.setupCallback('new_scene_activity', function(type, msg, timestamp) {
            self.onSceneActivity(type, msg, timestamp) } );
    },
    
    actions: {
        
        refresh() {
            this.set('newActivity', false);
            this.send('reloadModel');
        },
        
        joinScene(id) {
          let api = this.gameApi;
          api.requestOne('joinScene', { id: id }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.flashMessages.success('You join the scene.');
              this.send('reloadModel'); 
          });
        },
        
        stopWatching(id) {
          let api = this.gameApi;
          api.requestOne('unwatchScene', { id: id }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.flashMessages.success('You are no longer watching that scene.');
              this.send('reloadModel'); 
          });
        },
        
        watchScene(id) {
          let api = this.gameApi;
          api.requestOne('watchScene', { id: id }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.flashMessages.success('You start watching that scene.');
              this.send('reloadModel'); 
          });
        }
    }
});