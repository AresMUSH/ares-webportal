import Component from '@ember/component';
import { set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Component.extend(AuthenticatedController, {
    scenePose: '',
    rollString: null,
    confirmDeleteScenePose: false,
    confirmDeleteScene: false,
    confirmReportScene: false,
    selectLocation: false,
    managePoseOrder: false,
    characterCard: false,
    newLocation: null,
    reportReason: null,
    poseType: null,
    poseChar: null,
    commandResponse: null,
    gameApi: service(),
    flashMessages: service(),
    gameSocket: service(),
    session: service(),

    updatePoseControls: function() {
      this.set('poseType', { title: 'Pose', id: 'pose' });
      if (this.scene) {
        this.set('poseChar', this.get('scene.poseable_chars')[0]);
      }
    },
    
    didInsertElement: function() {
      this.updatePoseControls();
    },
    
    sceneObserver: observer('scene', function() {
      this.updatePoseControls();
    }),
    
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
    
    rpgExtraInstalled: computed(function() {
      return this.get('scene.extras_installed').some(e => e == 'rpg');
    }),
    
    sceneAlerts: computed('scene.{is_watching,reload_required}', 'scrollPaused', function() {
      let alertList = [];
      if (this.scrollPaused) {
        alertList.push("Scrolling is paused!");
      }
      if (!this.get('scene.is_watching')) {
        alertList.push("You are not watching this scene.  You will not see new activity.");
      }
      if (this.get('scene.reload_required')) {
        alertList.push("This scene has changed status since you opened it.  Please reload the page.");
      }
      return alertList;
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
      collapseScene() {
        let api = this.gameApi;

        api.requestOne('collapseScenePoses', { id: this.get('scene.id') })
        .then( (response) => {
            if (response.error) {
                return;
            }
            this.flashMessages.success('The scene poses have been collapsed for editing.');
            this.refresh(); 
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
            this.set('scene.reload_required', true);
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
              if (response.command_response) {
                this.set('commandResponse', response.command_response);
              } else {
                this.set('commandResponse', '');
              }
              
              this.scrollDown();
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
                  this.refresh(); 
              }
              else if (status === 'restart') {
                  this.flashMessages.success('The scene has been restarted.');
                  this.refresh(); 
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
                this.refresh(); 
              }
          });
      },
      
      scrollDown() {
        this.scrollDown();
      },
      
      pauseScroll() {
        this.setScroll(false);
      },
      unpauseScroll() {
        this.setScroll(true);
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
      },
      
      reportScene() {
        let api = this.gameApi;
        this.set('confirmReportScene', false);

        api.requestOne('reportScene', { id: this.get('scene.id'), reason: this.get('reportReason') })
        .then( (response) => {
            if (response.error) {
                return;
            }
            this.set('reportReason', null);
            this.flashMessages.success('Thank you.  The scene has been reported.');
        });
      },
    }
});
