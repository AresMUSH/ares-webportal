import { set } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { localTime } from 'ares-webportal/helpers/local-time';
import { inject as service } from '@ember/service';

export default Mixin.create({
  session: service(),
  flashMessages: service(),
    
  updateSceneData: function(scene, msg, timestamp) {
    let splitMsg = msg.split('|');
    /* let sceneId = */ splitMsg.shift();
    /* let char = */ splitMsg.shift();
    let activityType = splitMsg.shift();
    let activityData = splitMsg.join("|");
    let notify = true;

    let localTimestamp = localTime(timestamp); 
    scene.set('is_unread', false);
    
    if (activityType == 'new_pose') {
      let poseData = JSON.parse(activityData);
      let poses = scene.get('poses');
      if (poseData.char.id == this.get('session.data.authenticated.id')) {
        scene.set('can_edit', true);
        if (!poseData.can_edit) {
          poseData.can_edit = true;
          poseData.can_delete = true;
        }
      }
      poseData.timestamp = localTimestamp;
      poses.pushObject(poseData);
      scene.get('pose_order').setObjects(poseData.pose_order);
    } else if (activityType == 'pose_updated') {
      let poseData = JSON.parse(activityData);
      let poses = scene.get('poses');
      poseData.timestamp = localTimestamp;
      poses.forEach((p) => {
        if (p.id === poseData.id) {
          set(p, 'pose', poseData.pose);
          set(p, 'raw_pose', poseData.raw_pose);
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
