import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  selectSpendLuck: false,
  luckReason: null,
  tagName: '',
  gameApi: service(),
  flashMessages: service(),

  actions: {

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
      reason: luckReason }, null)
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
        this.set('scene.combat', response.id);
      });
    }
  }
});
