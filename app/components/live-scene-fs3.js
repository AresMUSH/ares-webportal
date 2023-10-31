import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  selectSpendLuck: false,
  selectSkillRoll: false,
  luckReason: null,
  numPoints: null,
  tagName: '',
  gameApi: service(),
  flashMessages: service(),

  actions: {

    spendLuck() {
      let api = this.gameApi;
      let luckReason = this.luckReason;
      let numPoints = parseInt(this.numPoints, 10);
    
      this.set('selectSpendLuck', false);
      this.set('luckReason', null);
      this.set('numPoints', null);
          
      if (!luckReason) {
        this.flashMessages.danger("You haven't given a reason for your luck spend.");
        return;
      }
      if (!numPoints) {
        this.flashMessages.danger("You haven't given a number of points to spend.");
        return;
      }

      api.requestOne('spendLuck', { scene_id: this.get('scene.id'),
        reason: luckReason, sender: this.get('scene.poseChar.name'), num_points: numPoints }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
      });
    },
    
    startCombat() {
      let api = this.gameApi;
      api.requestOne('startCombat', { scene_id: this.get('scene.id') }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.set('scene.combat', response);
      });
    }
  }
});
