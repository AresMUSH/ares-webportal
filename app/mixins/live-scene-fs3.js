import Mixin from '@ember/object/mixin';

export default Mixin.create({
    selectSkillRoll: false,
    selectSpendLuck: false,
    luckReason: null,

  actions: {

      addSceneRoll() {
          let api = this.get('gameApi');
          
          // Needed because the onChange event doesn't get triggered when the list is 
          // first loaded, so the roll string is empty.
          let rollString = this.get('rollString') || this.get('abilities')[0];
          
          if (!rollString) {
              this.get('flashMessages').danger("You haven't selected an ability to roll.");
              return;
          }
          this.set('selectSkillRoll', false);
          this.set('rollString', null);

          api.requestOne('addSceneRoll', { scene_id: this.get('scene.id'),
              roll_string: rollString })
          .then( (response) => {
              if (response.error) {
                  return;
              }
          });
      },
      
      spendLuck() {
          let api = this.get('gameApi');
          let luckReason = this.get('luckReason');
    
          this.set('selectSpendLuck', false);
          this.set('luckReason', null);
          
          if (!luckReason) {
              this.get('flashMessages').danger("You haven't given a reason for your luck spend.");
              return;
          }

          api.requestOne('spendLuck', { scene_id: this.get('scene.id'),
              reason: luckReason }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
          });
      }
  }
});