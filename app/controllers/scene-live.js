import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import SceneUpdate from 'ares-webportal/mixins/scene-update';
import { action } from '@ember/object';
import { scrollElementToBottom } from 'ares-webportal/helpers/scroll-element';

export default Controller.extend(AuthenticatedController, SceneUpdate, {
  gameApi: service(),
  flashMessages: service(),
  gameSocket: service(),
  session: service(),
  favicon: service(),
    
  onSceneActivity: function(type, msg, timestamp ) {
    let splitMsg = msg.split('|');
    let sceneId = splitMsg[0];       
    let char = splitMsg[1];
    let currentUsername = this.get('currentUser.name');
    let alts = this.model.app.alts ? this.model.app.alts.map(c => c.name) : [ currentUsername ];
        
    if (sceneId === this.get('model.scene.id')) {
      let notify = this.updateSceneData(this.get('model.scene'), msg, timestamp);
          
      // -1 is not found
      if (notify && alts.indexOf(char) < 0) {
        this.gameSocket.notify(`New activity from ${char} in scene ${sceneId}.`);
      }
          
      this.scrollSceneWindow();
      this.markSceneRead();
    }
  },
    
  pageTitle: computed('model.scene.id', function() {
    return 'Scene ' + this.get('model.scene.id');
  }),
    

  resetOnExit: function() {
    this.set('scrollPaused', false);
  },
    
  scrollSceneWindow: function() {
    // Unless scrolling paused or edit active
    let poseEditActive =  this.get('model.scene.poses').some(p => p.editActive);
    if (this.scrollPaused || poseEditActive) {
      return;
    }
    
    scrollElementToBottom('live-scene-log');
  },
    
  setupCallback: function() {
    let self = this;
    this.gameSocket.setupCallback('new_scene_activity', function(type, msg, timestamp) {
      self.onSceneActivity(type, msg, timestamp) 
    } );
  },
    
  markSceneRead: function() {
    this.gameApi.requestOne('markSceneRead', { id: this.get('model.scene.id') });
  },
    
  @action 
  scrollScene() {
    this.scrollSceneWindow();
  },
      
  @action
  refresh() {
    this.resetOnExit();
    this.send('reloadModel');
  },
        
  @action
  setScroll(option) {
    this.set('scrollPaused', !option);
    if (option) {
      this.scrollSceneWindow();
    }
  }
});