import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  selectSkillRoll: false,
  selectSpendLuck: false,
  luckReason: null,
  vsRoll1: null,
  vsRoll2: null,
  vsName1: null,
  vsName2: null,
  pcRollSkill: null,
  pcRollName: null,
  rollString: null,
  tagName: '',
  gameApi: service(),
  flashMessages: service(),

  actions: {

    addSceneRoll() {
      let api = this.gameApi;
      
      // Needed because the onChange event doesn't get triggered when the list is 
      // first loaded, so the roll string is empty.
      let rollString = this.rollString || this.abilities[0];
      let vsRoll1 = this.vsRoll1;
      let vsRoll2 = this.vsRoll2;
      let vsName1 = this.vsName1;
      let vsName2 = this.vsName2;
      let pcRollSkill = this.pcRollSkill;
      let pcRollName = this.pcRollName;
          
      if (!rollString) {
        this.flashMessages.danger("You haven't selected an ability to roll.");
        return;
      }
      
      if (vsRoll1 || vsRoll2 || vsName1 || vsName2) {
        if (!vsRoll2 || !vsName1 || !vsName2) {
          this.flashMessages.danger("You have to provide all opposed skill information.");
          return;
        }
      }
      
      if (pcRollSkill || pcRollName) {
        if (!pcRollSkill || !pcRollName) {
          this.flashMessages.danger("You have to provide all skill information to roll for a PC.");
          return;
        }
      }
      this.set('selectSkillRoll', false);
      this.set('rollString', null);
      this.set('vsRoll1', null);
      this.set('vsRoll2', null);
      this.set('vsName1', null);
      this.set('vsName2', null);
      this.set('pcRollSkill', null);
      this.set('pcRollName', null);

      api.requestOne('addSceneRoll', { scene_id: this.get('scene.id'),
         roll_string: rollString,
         vs_roll1: vsRoll1,
         vs_roll2: vsRoll2,
         vs_name1: vsName1,
         vs_name2: vsName2,
         pc_name: pcRollName,
         pc_skill: pcRollSkill }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
      });
    },
      
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
