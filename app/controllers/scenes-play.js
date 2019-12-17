import $ from "jquery"
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import SceneUpdate from 'ares-webportal/mixins/scene-update';

export default Controller.extend(AuthenticatedController, SceneUpdate, {
    gameApi: service(),
    flashMessages: service(),
    gameSocket: service(),
    session: service(),
    favicon: service(),
    
    scrollPaused: false,
    currentScene: null,
    
    anyNewActivity: computed('model.scenes.@each.is_unread', function() {
      return this.get('model.scenes').any(s => s.is_unread );
    }),
  
    onSceneActivity: function(type, msg, timestamp ) {
      let splitMsg = msg.split('|');
      let sceneId = splitMsg[0];
      let char = splitMsg[1];
      let notify = true;
      let currentUsername = this.get('currentUser.name');
      
        // For poses we can just add it to the display.  Other events require a reload.
        if (sceneId === this.get('currentScene.id')) {
          let scene = this.currentScene;
          
          notify = this.updateSceneData(scene, msg, timestamp);

          if (currentUsername != char) {
            scene.set('is_unread', false);
          }
          else {
            notify = false;
          }
          
          if (notify) {
            this.gameSocket.notify(`New activity from ${char} in scene ${sceneId}.`);
            this.scrollSceneWindow();
          }
          
        }
        else {
            this.get('model.scenes').forEach(s => {
                if (s.id === sceneId) {
                  notify = this.updateSceneData(s, msg, timestamp);
                  if (currentUsername != char) {
                    s.set('is_unread', true);
                    this.gameSocket.notify(`New activity from ${char} in one of your other scenes (${sceneId}).`);
                  }
                }
            });            
        }
    },

    resetOnExit: function() {
        this.set('scrollPaused', false);
    },
    
    setupCallback: function() {
        let self = this;
        this.gameSocket.setupCallback('new_scene_activity', function(type, msg, timestamp) {
            self.onSceneActivity(type, msg, timestamp) } );
    },
    
    scrollSceneWindow: function() {
      // Unless scrolling paused or edit active.
      let poseEditActive =  this.get('currentScene.poses').some(p => p.editActive);
      if (this.scrollPaused || poseEditActive) {
        return;
      }
      
        try {
          $('#live-scene-log').stop().animate({
              scrollTop: $('#live-scene-log')[0].scrollHeight
          }, 400); 
        }
        catch(error) {
          // This happens sometimes when transitioning away from screen.
        }   
  
    },
    
    actions: {
        
        
        scrollScene() {
          this.scrollSceneWindow();
        },
        
        refresh() {
            this.resetOnExit();
            this.send('reloadModel');
        },
        
        setScroll(option) {
          this.set('scrollPaused', !option);
          if (option) {
            this.scrollSceneWindow();
          }
        },
        
        switchScene(id) {
          this.get('model.scenes').forEach(s => {
              if (s.id === id) {
                  s.set('is_unread', false);
                  this.set('currentScene', s);
                  let self = this;
                  setTimeout(() => self.scrollSceneWindow(), 150, self);
                  
                  let api = this.gameApi;
                  api.requestOne('markSceneRead', { id: id }, null)
                  .then( (response) => {
                      if (response.error) {
                          return;
                      }
                  }); 
              }
          });   
        }
    }
});