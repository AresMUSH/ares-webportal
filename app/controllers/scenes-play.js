import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),
    gameSocket: service(),
    session: service(),
    favicon: service(),
    
    scenePose: '',
    rollString: null,
    confirmDeleteScenePose: false,
    selectSkillRoll: false,
    selectLocation: false,
    newLocation: null,
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

    rollEnabled: function() {
      return this.get('model.abilities').length > 0;
    }.property('model.abilities'),
    
    sceneTitle: function() {
        return 'Scene ' + this.get('currentScene.id');
    }.property('currentScene.id'),
    
    resetOnExit: function() {
        this.set('scenePose', '');
        this.set('rollString', null);
        this.set('confirmDeleteScenePose', false);
        this.set('selectSkillRoll', false)
    },
    
    setupCallback: function() {
        let self = this;
        
        this.get('gameSocket').set('sceneCallback', function(data) {
            self.onSceneActivity(data) } );
    },
    
    showSceneSelection: function() {
      return this.get('model.scenes').length > 0;
    }.property('model.scenes.@each.id'),
    
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
    
    scenePoses: function() {
        return this.get('currentScene.poses').map(p => Ember.Object.create(p));  
    }.property('currentScene.poses.@each.id'),
    
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
        scene.set('reloadRequired', true);
      }
    },
    
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

            api.requestOne('changeSceneLocation', { scene_id: this.get('currentScene.id'),
                location: newLoc })
            .then( (response) => {
                if (response.error) {
                    return;
                }
            });
        },
        
        cookies() {
            let api = this.get('gameApi');
            api.requestOne('sceneCookies', { id: this.get('currentScene.id') }, null)
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

            let scenePose = this.get('currentScene.poses').find(p => p.id === poseId);
            this.get('currentScene.poses').removeObject(scenePose);

            api.requestOne('deleteScenePose', { scene_id: this.get('currentScene.id'),
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
            api.requestOne('editScenePose', { scene_id: this.get('currentScene.id'),
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
            api.requestOne('addScenePose', { id: this.get('currentScene.id'),
                pose: pose, pose_type: poseType })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.scrollSceneWindow();
            });
        },
        
        addSceneRoll() {
            let api = this.get('gameApi');
            
            // Needed because the onChange event doesn't get triggered when the list is 
            // first loaded, so the roll string is empty.
            let rollString = this.get('rollString') || this.get('model.abilities')[0];
            
            if (!rollString) {
                this.get('flashMessages').danger("You haven't selected an ability to roll.");
                return;
            }
            this.set('selectSkillRoll', false);
            this.set('rollString', null);

            api.requestOne('addSceneRoll', { scene_id: this.get('currentScene.id'),
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
            api.requestOne('changeSceneStatus', { id: this.get('currentScene.id'),
                status: status }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                if (status === 'share') {
                    this.get('flashMessages').success('The scene has been shared.');
                    this.transitionToRoute('scene', this.get('currentScene.id'));
                }
                else if (status === 'stop') {
                    this.get('flashMessages').success('The scene has been stopped.');
                    this.send('reloadModel');
                }
                else if (status === 'restart') {
                    this.get('flashMessages').success('The scene has been restarted.');
                    this.send('reloadModel'); 
                }
            });
        },
        
        watchScene(option) {
            let api = this.get('gameApi');
            let command = option ? 'watchScene' : 'unwatchScene';
            api.requestOne(command, { id: this.get('currentScene.id') }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                let message = option ? 'now watching' : 'no longer watching';
                this.get('currentScene').set('is_watching', option);
                this.get('flashMessages').success(`You are ${message} the scene.`);
            });
        },
        
        scrollDown() {
          this.scrollSceneWindow();
        },
        
        refresh() {
            this.resetOnExit();
            this.send('reloadModel');
        },
        
        pauseScroll() {
          this.set('scrollPaused', true);
        },
        
        switchScene(id) {
          this.get('model.scenes').forEach(s => {
              if (s.id === id) {
                  s.set('is_unread', false);
                  this.set('currentScene', s);
              }
          });   
        },
        
        unpauseScroll() {
          this.set('scrollPaused', false);
          this.scrollSceneWindow();
        }
    }
});