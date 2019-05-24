import Controller from '@ember/controller';
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
    
    onSceneActivity: function(msg /* , timestamp */) {
      let splitMsg = msg.split('|');
      let sceneId = splitMsg[0];
      let char = splitMsg[1];
      let notify = true;
      
        // For poses we can just add it to the display.  Other events require a reload.
        if (sceneId === this.get('currentScene.id')) {
          let scene = this.get('currentScene');
          scene.set('is_unread', false);
          
          notify = this.updateSceneData(scene, msg);
          
          if (notify) {
            this.get('gameSocket').notify(`New activity from ${char} in scene ${sceneId}.`);
            this.scrollSceneWindow();
          }
          
        }
        else {
            this.get('model.scenes').forEach(s => {
                if (s.id === sceneId) {
                  notify = this.updateSceneData(s, msg);
                  s.set('is_unread', true);
                  this.get('gameSocket').notify(`New activity from ${char} in one of your other scenes (${sceneId}).`);
                }
            });            
        }
    },

    resetOnExit: function() {
        this.set('scrollPaused', false);
    },
    
    setupCallback: function() {
        let self = this;
        
        this.get('gameSocket').set('sceneCallback', function(data) {
            self.onSceneActivity(data) } );
    },
    
    scrollSceneWindow: function() {
      // Unless scrolling paused 
      if (this.get('scrollPaused')) {
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
                  
                  let api = this.get('gameApi');
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