import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Component.extend({
  gameApi: service(),
  flashMessages: service(),
  newAbility: '',

  @action
  learnAbility(ability) {
    let api = this.gameApi;
    api.requestOne('learnAbility', { ability: ability.name, char: this.get('char.name') }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
            
      this.flashMessages.success('Learned!');
      this.abilityLearned();
    });
  },
        
  @action
  learnNewAbility() {
    let api = this.gameApi;
    let name = this.newAbility;
              
    if (name.length == 0) {
      return;
    }
              
    api.requestOne('learnAbility', { ability: name, char: this.get('char.name') }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
            
      this.flashMessages.success('Learned!');
      this.abilityLearned();
    });
  }
        
});
