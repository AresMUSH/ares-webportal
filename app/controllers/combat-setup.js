import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  router: service(),

  teams: computed(function() {
    return [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
  }),
    
  passengerTypes: computed(function() {
    return [ 'pilot', 'passenger', 'none' ];
  }),
    
  @action
  save() {
    let api = this.gameApi;
    api.requestOne('saveCombatSetup', 
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
        
  @action
  stanceChanged(id, stance) {
    this.set(`model.combatants.${id}.stance`, stance);
  },
        
  @action
  weaponChanged(id, weapon) {
    this.set(`model.combatants.${id}.weapon`, weapon);
  },
        
  @action
  armorChanged(id, armor) {
    this.set(`model.combatants.${id}.armor`, armor);
  },
        
  @action
  npcChanged(id, skill) {
    this.set(`model.combatants.${id}.npc_skill`, skill);
  },
        
  @action
  passengerTypeChanged(id, type) {
    this.set(`model.combatants.${id}.passenger_type`, type);
  },
        
  @action
  actionChanged(id, action) {
    this.set(`model.combatants.${id}.action`, action);
    this.set(`model.combatants.${id}.action_args`, '');
  },
        
  @action
  addTarget(id, target) {
    let argRef = `model.combatants.${id}.action_args`;
    this.set(argRef, `${this.get(argRef) || ''} ${target}`);
  },
});