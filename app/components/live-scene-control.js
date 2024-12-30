import Component from '@ember/component';
import { set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import { action } from '@ember/object';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { removeObject } from 'ares-webportal/helpers/object-ext';

export default Component.extend(AuthenticatedController, {
  rollString: null,
  confirmDeleteScenePose: false,
  confirmDeleteScene: false,
  confirmReportScene: false,
  selectLocation: false,
  managePoseOrder: false,
  characterCard: false,
  characterCardInfo: null,
  newLocation: null,
  reportReason: null,
  poseType: null,
  commandResponse: null,
  showInvitation: false,
  selectedInvitee: null,
  gameApi: service(),
  flashMessages: service(),
  gameSocket: service(),
  session: service(),
  router: service(),

  updatePoseControls: function() {
    this.set('poseType', { title: 'Pose', id: 'pose' });
    if (this.scene && !this.get('scene.poseChar')) {
        
      let self = this;
      this.scene.poseable_chars.forEach(c => {
        if (!this.get('scene.poseChar') && self.scene.participants.some(w => w.name == c.name)) {
          self.set('scene.poseChar', c);
        }
      });
      
      if (!this.get('scene.poseChar')) {
        this.set('scene.poseChar', this.get('scene.poseable_chars')[0]);
      }  
    }
  },
    
  didInsertElement: function() {
    this._super(...arguments);
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
      
  txtExtraInstalled: computed(function() {
    return this.isExtraInstalled('txt');
  }),
    
  cookiesExtraInstalled: computed(function() {
    return this.isExtraInstalled('cookies');
  }),
    
  rpgExtraInstalled: computed(function() {
    return this.isExtraInstalled('rpg');
  }),
    
  fateExtraInstalled: computed(function() {
    return this.isExtraInstalled('fate');
  }),
    
  diceExtraInstalled: computed(function() {
    return this.isExtraInstalled('dice');
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
    
  isExtraInstalled(name) {
    return this.get('scene.extras_installed').some(e => e == name); 
  },
    
  @action
  locationSelected(loc) {
    this.set('newLocation', loc);  
  },
      
  @action
  changeInvitee(char) {
    this.set('selectedInvitee', char);
  },
      
  @action
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
      
  @action
  editScenePose(scenePose) { 
    set(scenePose, 'editActive', true);
  },
      
  @action
  cancelScenePoseEdit(scenePose) {
    set(scenePose, 'editActive', false);
  },
      
  @action
  deleteScenePose() {
    let api = this.gameApi;
    let poseId = this.get('confirmDeleteScenePose.id');
    this.set('confirmDeleteScenePose', false);

    let scenePose = this.get('scene.poses').find(p => p.id === poseId);
    removeObject(this.get('scene.poses'), scenePose, this.scene, 'poses');

    api.requestOne('deleteScenePose', { scene_id: this.get('scene.id'),
    pose_id: poseId })
    .then( (response) => {
      if (response.error) {
        return;
      }
    });
  },
      
  @action
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
      
  @action
  deleteScene() {
    let api = this.gameApi;
    this.set('confirmDeleteScene', false);

    api.requestOne('deleteScene', { id: this.get('scene.id') })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.flashMessages.success('The scene has been marked for deletion.');
      this.router.transitionTo('scenes-live');
    });
  },
      
  @action
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
      
  @action
  loadLastPose() {
    this.set('scene.draftPose', this.get('scene.lastDraftPose'));
  },
      
  @action
  addPose(poseType) {
    let pose = this.get('scene.draftPose') || "";
    if (pose.length === 0) {
      this.flashMessages.danger("You haven't entered anything.");
      return;
    }
    let api = this.gameApi;
    this.set('scene.lastDraftPose', pose);
    this.set('scene.draftPose', '');

    api.requestOne('addScenePose', { id: this.get('scene.id'),
    pose: pose, 
    pose_type: poseType,
    pose_char: this.get('scene.poseChar.id') }, null, true)
    .then( (response) => {
      if (response.error) {
        return;
      }
      if (response.command_response) {
        this.set('commandResponse', response.command_response);
      } else {
        this.set('commandResponse', '');
      }
              
      this.onScrollDown();
    });
  },
      
  @action
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
      
  @action
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
      
  @action
  inviteChar() {
    let api = this.gameApi;
    let invitee = this.selectedInvitee;
    this.set('selectedInvitee', null);
    this.set('showInvitation', false);
          
    api.requestOne('inviteToScene', { id: this.get('scene.id'), invitee: invitee.name }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.flashMessages.success(`Invitation sent.`);
    });
  },
      
  @action
  scrollDown() {
    this.onScrollDown();
  },
      
  @action
  pauseScroll() {
    this.onSetScroll(false);
  },
      
  @action
  unpauseScroll() {
    this.onSetScroll(true);
  },
      
  @action
  poseTypeChanged(newType) {
    this.set('poseType', newType);
  },
      
  @action
  poseCharChanged(newChar) { 
    this.set('scene.poseChar', newChar);
  },
      
  @action
  showCharCard(char) {
    let api = this.gameApi;
    api.requestOne('sceneCard', { char: char }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.set('characterCardInfo', response);
      this.set('characterCard', true);
    });
  },
      
  @action
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
      
  @action
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
      
  @action
  reportScene() {
    let api = this.gameApi;
    this.set('confirmReportScene', false);

    api.requestOne('reportScene', { id: this.get('scene.id'), reason: this.reportReason })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.set('reportReason', null);
      this.flashMessages.success('Thank you.  The scene has been reported.');
    });
  },
  
  @action
  setCharacterCard(value) {
    this.set('characterCard', value);
  },
    
  @action
  setManagePoseOrder(value) {
    this.set('managePoseOrder', value);
  },
  
  @action
  setSelectLocation(value) {
    this.set('selectLocation', value);
  },
  
  @action
  setShowInvitation(value) {
    this.set('showInvitation', value);
  },
  
  @action
  setConfirmDeleteScene(value) {
    this.set('confirmDeleteScene', value);
  },
  
  @action
  setConfirmDeleteScenePose(value) {
    this.set('confirmDeleteScenePose', value);
  },
  
  @action
  setConfirmReportScene(value) {
    this.set('confirmReportScene', value);
  },
  
});
