import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  session: service(),
  flashMessages: service(),
    
  updateSceneData: function(scene, msg) {
    let splitMsg = msg.split('|');
    //let sceneId = splitMsg[0];
    //let char = splitMsg[1];
    let activityType = splitMsg[2];
    let activityData = splitMsg[3];
    let notify = true;

    scene.set('is_unread', false);
    
    if (activityType == 'new_pose') {
      let poseData = JSON.parse(activityData);
      let poses = scene.get('poses');
      if (!poseData.can_edit && (poseData.char.id == this.get('session.data.authenticated.id'))) {
        poseData.can_edit = true;
        poseData.can_delete = true;
      }
      poses.pushObject(poseData);
      scene.get('pose_order').setObjects(poseData.pose_order);
    } else if (activityType == 'pose_updated') {
      let poseData = JSON.parse(activityData);
      let poses = scene.get('poses');
      poses.forEach((p) => {
        if (p.id === poseData.id) {
          Ember.set(p, 'pose', poseData.pose);
          Ember.set(p, 'raw_pose', poseData.raw_pose);
        }
      });
      notify = false;
    }
    else if (activityType == 'pose_deleted') {
      let poseData = JSON.parse(activityData);
      let poses = scene.get('poses');
      poses.forEach(p => {
        if (p.id === poseData.id) {
          poses.removeObject(p);
        }
      });
      notify = false;
    } else if (activityType == 'location_updated') {
      let locationData = JSON.parse(activityData);
      scene.set('location', locationData);
      notify = true;
    } else {
      scene.set('reload_required', true);            
    }
    
    return notify;
  }
});
