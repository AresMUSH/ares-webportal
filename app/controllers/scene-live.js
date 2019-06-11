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
    
    onSceneActivity: function(msg /* , timestamp */) {
        let splitMsg = msg.split('|');
        let sceneId = splitMsg[0];       
        let char = splitMsg[1];
        let currentUsername = this.get('currentUser.name');
        
        if (sceneId === this.get('model.scene.id')) {
          let notify = this.updateSceneData(this.get('model.scene'), msg);
          
          if (notify && (char != currentUsername)) {
            this.get('gameSocket').notify(`New activity from ${char} in scene ${sceneId}.`);
          }
          
          this.scrollSceneWindow();
        }
    },
    
    pageTitle: function() {
        return 'Scene ' + this.get('model.scene.id');
    }.property('model.scene.id'),
    

    resetOnExit: function() {
        this.set('scrollPaused', false);
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
    
    setupCallback: function() {
        let self = this;
        
        this.get('gameSocket').set('sceneCallback', function(data) {
            self.onSceneActivity(data) } );
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
        }
    }
});