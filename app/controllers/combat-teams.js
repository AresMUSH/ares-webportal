import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  router: service(),

  teams: computed(function() {
    return [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ];
  }),
    
  @action
  save() {
    let api = this.gameApi;
    api.requestOne('saveCombatTeams', 
    {
      id: this.get('model.id'), 
      combatants: this.get('model.combatants')
    }, null )
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('combat', this.get('model.id'));
      this.flashMessages.success('Combat saved!');
    });
  },
        
  @action
  teamChanged(id, team) {
    this.set(`model.combatants.${id}.team`, team);
  },
});