import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    gameApi: service(),
    flashMessages: service(),
    newAbility: '',

    actions: { 
      learnAbility(ability) {
            let api = this.gameApi;
            api.requestOne('learnAbility', { ability: ability.name }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
            
                this.flashMessages.success('Learned!');
                this.abilityLearned();
            });
        },
        learnNewAbility() {
              let api = this.gameApi;
              let name = this.newAbility;
              
              if (name.length == 0) {
                return;
              }
              
              api.requestOne('learnAbility', { ability: name }, null)
              .then( (response) => {
                  if (response.error) {
                      return;
                  }
            
                  this.flashMessages.success('Learned!');
                  this.abilityLearned();
              });
          }
        
    }
});
