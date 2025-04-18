import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Component.extend({
  selectSpendLuck: false,
  selectSkillRoll: false,
  luckReason: null,
  tagName: '',
  gameApi: service(),
  flashMessages: service(),

  @action
  spendLuck() {
    let api = this.gameApi;
    let luckReason = this.luckReason;
    
    this.set('selectSpendLuck', false);
    this.set('luckReason', null);
          
    if (!luckReason) {
      this.flashMessages.danger("You haven't given a reason for your luck spend.");
      return;
    }

    api.requestOne('spendLuck', { scene_id: this.get('scene.id'),
    reason: luckReason, sender: this.get('scene.poseChar.name') }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
    });
  },
    
  @action
  startCombat() {
    let api = this.gameApi;
    api.requestOne('startCombat', { scene_id: this.get('scene.id') }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.set('scene.combat', response);
    });
  },
  
  @action
  setSelectSkillRoll(value) {
    this.set('selectSkillRoll', value);
  },
  
  @action
  setSelectSpendLuck(value) {
    this.set('selectSpendLuck', value);
  }
});
