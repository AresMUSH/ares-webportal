import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    gameApi: service(),
    flashMessages: service(),

    actions: { 
      learnAbility(ability) {
            let api = this.get('gameApi');
            api.requestOne('learnAbility', { ability: ability.name }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
            
                this.get('flashMessages').success('Saved!');
                this.sendAction('abilityLearned');
            });
        }
        
    }
});
