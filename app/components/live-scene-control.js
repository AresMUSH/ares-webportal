import Component from '@ember/component';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import LiveScenePlaces from 'ares-webportal/mixins/live-scene-places';
import LiveSceneFS3 from 'ares-webportal/mixins/live-scene-fs3';

export default Component.extend(AuthenticatedController, LiveScenePlaces, LiveSceneFS3, {
    scenePose: '',
    rollString: null,
    confirmDeleteScenePose: false,
    confirmDeleteScene: false,
    selectLocation: false,
    newLocation: null,
    gameApi: service(),
    flashMessages: service(),
    gameSocket: service(),
    session: service(),
  
    rollEnabled: function() {
      return this.get('abilities').length > 0;
    }.property('abilities'),
  
    scenePoses: function() {
        return this.get('scene.poses').map(p => Ember.Object.create(p));  
    }.property('scene.poses.@each.pose'),
      
    actions: { 
      locationSelected(loc) {
          this.set('newLocation', loc);  
      },
      changeLocation() {
          let api = this.get('gameApi');
          
          let newLoc = this.get('newLocation');
          if (!newLoc) {
              this.get('flashMessages').danger("You haven't selected a location.");
              return;
          }
          this.set('selectLocation', false);
          this.set('newLocation', null);

          api.requestOne('changeSceneLocation', { scene_id: this.get('scene.id'),
              location: newLoc })
          .then( (response) => {
              if (response.error) {
                  return;
              }
          });
      },
      
      editScenePose(scenePose) { 
          scenePose.set('editActive', true);
      },
      cancelScenePoseEdit(scenePose) {
          scenePose.set('editActive', false);
      },
      deleteScenePose() {
          let api = this.get('gameApi');
          let poseId = this.get('confirmDeleteScenePose.id');
          this.set('confirmDeleteScenePose', false);

          let scenePose = this.get('scene.poses').find(p => p.id === poseId);
          this.get('scene.poses').removeObject(scenePose);

          api.requestOne('deleteScenePose', { scene_id: this.get('scene.id'),
              pose_id: poseId })
          .then( (response) => {
              if (response.error) {
                  return;
              }
          });
      },
      deleteScene() {
        let api = this.get('gameApi');
        this.set('confirmDeleteScene', false);

        api.requestOne('deleteScene', { id: this.get('scene.id') })
        .then( (response) => {
            if (response.error) {
                return;
            }
            this.get('flashMessages').success('The scene has been deleted.');
            this.sendAction('refresh'); 
        });
      },
      saveScenePose(scenePose, notify) {
          let pose = scenePose.get('raw_pose');
          if (pose.length === 0) {
              this.get('flashMessages').danger("You haven't entered anything.");
              return;
          }
          scenePose.set('editActive', false);
          scenePose.set('pose', pose);

          let api = this.get('gameApi');
          api.requestOne('editScenePose', { scene_id: this.get('scene.id'),
              pose_id: scenePose.id, pose: pose, notify: notify })
          .then( (response) => {
              if (response.error) {
                  return;
              }
              scenePose.set('pose', response.pose);
          });
          this.set('scenePose', '');
      },
      
      addPose(poseType) {
          let pose = this.get('scenePose');
          if (pose.length === 0) {
              this.get('flashMessages').danger("You haven't entered anything.");
              return;
          }
          let api = this.get('gameApi');
          this.set('scenePose', '');
          api.requestOne('addScenePose', { id: this.get('scene.id'),
              pose: pose, pose_type: poseType })
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.sendAction('scrollScene');
          });
      },
      
      changeSceneStatus(status) {
          let api = this.get('gameApi');
          if (status === 'share') {
              this.get('gameSocket').set('sceneCallback', null);
          }
          this.set('scene.reload_required', true);
          
          api.requestOne('changeSceneStatus', { id: this.get('scene.id'),
              status: status }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              if (status === 'share') {
                  this.get('flashMessages').success('The scene has been shared.');
              }
              else if (status === 'stop') {
                  this.get('flashMessages').success('The scene has been stopped.');
                  this.sendAction('refresh'); 
              }
              else if (status === 'restart') {
                  this.get('flashMessages').success('The scene has been restarted.');
                  this.sendAction('refresh'); 
              }
          });
      },
      
      watchScene(option) {
          let api = this.get('gameApi');
          let command = option ? 'watchScene' : 'unwatchScene';
          api.requestOne(command, { id: this.get('scene.id') }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              let message = option ? 'now watching' : 'no longer watching';
              this.get('flashMessages').success(`You are ${message} the scene.`);
              this.get('scene').set('is_watching', option);
              
              if (option) {
                this.sendAction('refresh'); 
              }
          });
      },
      
      scrollDown() {
        this.sendAction('scrollScene');
      },
      
      pauseScroll() {
        this.sendAction('setScroll', false);
      },
      unpauseScroll() {
        this.sendAction('setScroll', true);
      }
    }
});
