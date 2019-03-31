import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),
    gameSocket: service(),
    session: service(),
    favicon: service(),

    onSceneActivity: function(msg /* , timestamp */) {
        let splitMsg = msg.split('|');
        let sceneId = splitMsg[0];
        let char = splitMsg[1];
        let activityType = splitMsg[2];
        let activityData = splitMsg[3];
        let notify = true;

        if (sceneId === this.get('model.scene.id')) {
          if (activityType == 'new_pose') {
            let poseData = JSON.parse(activityData);
            let poses = this.get('model.scene.poses');
            if (!poseData.can_edit && (poseData.char.id == this.get('session.data.authenticated.id'))) {
              poseData.can_edit = true;
              poseData.can_delete = true;
            }
            poses.pushObject(poseData);
            this.set('model.scene.pose_order', poseData.pose_order);
          } else if (activityType == 'pose_updated') {
            let poseData = JSON.parse(activityData);
            let poses = this.get('model.scene.poses');
            poses.forEach((p, i) => {
              if (p.id === poseData.id) {
                Ember.set(p, 'pose', poseData.pose);
                Ember.set(p, 'raw_pose', poseData.raw_pose);
              }
            });
            notify = false;
          }
          else if (activityType == 'pose_deleted') {
            let poseData = JSON.parse(activityData);
            let poses = this.get('model.scene.poses');
            poses.forEach(p => {
              if (p.id === poseData.id) {
                poses.removeObject(p);
              }
            });
            notify = false;
          } else if (activityType == 'location_updated') {
            let locationData = JSON.parse(activityData);
            this.set('model.scene.location', locationData);
            notify = false;
          } else {
            this.set('model.scene.reload_required', true);
          }

          if (notify) {
            this.get('gameSocket').notify('New scene activity!');
            this.scrollSceneWindow();
          }
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
