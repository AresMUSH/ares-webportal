import Component from '@ember/component';
import { set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Component.extend(AuthenticatedController, {
    scenePose: '',
    rollString: null,
    confirmDeleteScenePose: false,
    confirmDeleteScene: false,
    selectLocation: false,
    managePoseOrder: false,
    characterCard: false,
    newLocation: null,
    poseType: null,
    poseChar: null,
    gameApi: service(),
    flashMessages: service(),
    gameSocket: service(),
    session: service(),

    init: function() {
      this._super(...arguments);
      this.set('poseType', { title: 'Pose', id: 'pose' });
    },
      
    didInsertElement: function() {
      this.set('poseChar', this.get('scene.poseable_chars')[0]);
    },
    
    poseTypes: computed(function() {
      return [
        { title: 'Pose', id: 'pose' },
        { title: 'GM Emit', id: 'gm' },
        { title: 'Scene Set', id: 'setpose' }
      ];
    }),
    
    poseOrderTypes: computed(function() {
      return [ '3-per', 'normal' ];
    }),
    
    characterCardInfo: computed('characterCard', function() {
      let participant = this.get('scene.participants').find(p => p.name == this.characterCard);
      return participant ? participant.char_card : {};
    }),
  
    txtExtraInstalled: computed(function() {
      return this.get('scene.extras_installed').some(e => e == 'txt');
    }),
    
    cookiesExtraInstalled: computed(function() {
      return this.get('scene.extras_installed').some(e => e == 'cookies');
    }),
    
    actions: { 
      locationSelected(loc) {
          this.set('newLocation', loc);  
      },
      changeLocation() {
          let api = this.gameApi;
          
          let newLoc = this.newLocation;
          if (!newLoc) {
              this.flashMessages.danger("You haven't selected a location.");
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
          set(scenePose, 'editActive', true);
      },
      cancelScenePoseEdit(scenePose) {
          set(scenePose, 'editActive', false);
      },
      deleteScenePose() {
          let api = this.gameApi;
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
        let api = this.gameApi;
        this.set('confirmDeleteScene', false);

        api.requestOne('deleteScene', { id: this.get('scene.id') })
        .then( (response) => {
            if (response.error) {
                return;
            }
            this.flashMessages.success('The scene has been deleted.');
            this.sendAction('refresh'); 
        });
      },
      saveScenePose(scenePose, notify) {
          let pose = scenePose.raw_pose;
          if (pose.length === 0) {
              this.flashMessages.danger("You haven't entered anything.");
              return;
          }
          set(scenePose, 'editActive', false);
          set(scenePose, 'pose', pose);

          let api = this.gameApi;
          api.requestOne('editScenePose', { scene_id: this.get('scene.id'),
              pose_id: scenePose.id, pose: pose, notify: notify })
          .then( (response) => {
              if (response.error) {
                  return;
              }
              set(scenePose, 'pose', response.pose);
          });
          this.set('scenePose', '');
      },
      
      addPose(poseType) {
          let pose = this.scenePose;
          if (pose.length === 0) {
              this.flashMessages.danger("You haven't entered anything.");
              return;
          }
          let api = this.gameApi;
          this.set('scenePose', '');
          api.requestOne('addScenePose', { id: this.get('scene.id'),
              pose: pose, 
              pose_type: poseType,
              pose_char: this.get('poseChar.id') })
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.sendAction('scrollScene');
          });
      },
      
      changeSceneStatus(status) {
          let api = this.gameApi;
          if (status === 'share') {
            this.gameSocket.removeCallback('new_scene_activity');
          }
          this.set('scene.reload_required', true);
          
          api.requestOne('changeSceneStatus', { id: this.get('scene.id'),
              status: status }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              if (status === 'share') {
                  this.flashMessages.success('The scene has been shared.');
              }
              else if (status === 'stop') {
                  this.flashMessages.success('The scene has been stopped.');
                  this.sendAction('refresh'); 
              }
              else if (status === 'restart') {
                  this.flashMessages.success('The scene has been restarted.');
                  this.sendAction('refresh'); 
              }
          });
      },
      
      watchScene(option) {
          let api = this.gameApi;
          let command = option ? 'watchScene' : 'unwatchScene';
          api.requestOne(command, { id: this.get('scene.id') }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              let message = option ? 'now watching' : 'no longer watching';
              this.flashMessages.success(`You are ${message} the scene.`);
              this.scene.set('is_watching', option);
              
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
      },
      
      poseTypeChanged(newType) {
        this.set('poseType', newType);
      },
      
      poseCharChanged(newChar) { 
        this.set('poseChar', newChar);
      },
      
      switchPoseOrderType(newType) {
        let api = this.gameApi;
        api.requestOne('switchPoseOrder', { id: this.get('scene.id'), type: newType }, null)
        .then( (response) => {
          this.set('managePoseOrder', false);
            if (response.error) {
                return;
            }
            this.set('scene.pose_order_type', newType);
        });
      },
      
      dropPoseOrder(name) {
        let api = this.gameApi;
        api.requestOne('dropPoseOrder', { id: this.get('scene.id'), name: name }, null)
        .then( (response) => {
            this.set('managePoseOrder', false);
            if (response.error) {
                return;
            }
        });
      }
    }
});
