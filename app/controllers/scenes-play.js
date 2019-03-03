import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
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
        let poseData = splitMsg[2];
        // For poses we can just add it to the display.  Other events require a reload.
        if (sceneId === this.get('currentScene.id')) {
          let scene = this.get('currentScene');
          this.updateSceneData(scene, poseData);
          scene.set('is_unread', false);
          this.get('gameSocket').notify('New scene activity!');
          this.scrollSceneWindow();
        }
        else {
            this.get('model.scenes').forEach(s => {
                if (s.id === sceneId) {
                    this.updateSceneData(s, poseData);
                    s.set('is_unread', true);
                    this.get('gameSocket').notify('New activity in one of your other scenes!');
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
          }, 800); 
        }
        catch(error) {
          // This happens sometimes when transitioning away from screen.
        }   
  
    },
    
    updateSceneData(scene, poseData) {
      if (poseData) {
        poseData = JSON.parse(poseData);
        let poses = scene.get('poses');
        if (!poseData.can_edit && (poseData.char.id == this.get('session.data.authenticated.id'))) {
          poseData.can_edit = true
          poseData.can_delete = true
        }
        poses.pushObject(poseData);
      } else {
        scene.set('reload_required', true);
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
              }
          });   
        }
    }
});