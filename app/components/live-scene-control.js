import Component from '@ember/component';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Component.extend(AuthenticatedController, {
    scenePose: '',
    rollString: null,
    confirmDeleteScenePose: false,
    selectSkillRoll: false,
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
  }.property('scene.poses.@each.id'),
  
    
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
      
      cookies() {
          let api = this.get('gameApi');
          api.requestOne('sceneCookies', { id: this.get('scene.id') }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.get('flashMessages').success('You give cookies to the scene participants.');
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
      
      addSceneRoll() {
          let api = this.get('gameApi');
          
          // Needed because the onChange event doesn't get triggered when the list is 
          // first loaded, so the roll string is empty.
          let rollString = this.get('rollString') || this.get('abilities')[0];
          
          if (!rollString) {
              this.get('flashMessages').danger("You haven't selected an ability to roll.");
              return;
          }
          this.set('selectSkillRoll', false);
          this.set('rollString', null);

          api.requestOne('addSceneRoll', { scene_id: this.get('scene.id'),
              roll_string: rollString })
          .then( (response) => {
              if (response.error) {
                  return;
              }
          });
      },
      
      changeSceneStatus(status) {
          let api = this.get('gameApi');
          if (status === 'share') {
              this.get('gameSocket').set('sceneCallback', null);
          }
          api.requestOne('changeSceneStatus', { id: this.get('scene.id'),
              status: status }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              if (status === 'share') {
                  this.get('flashMessages').success('The scene has been shared.');
                  this.transitionToRoute('scene', this.get('scene.id'));
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
