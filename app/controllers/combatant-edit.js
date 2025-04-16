import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import ConfirmAction from 'ares-webportal/mixins/confirm-action';

export default Controller.extend(ConfirmAction, {
  gameApi: service(),
  flashMessages: service(),
  router: service(),
    
  resetOnExit: function() {
    this.hideActionConfirmation();
  },
  
  teams: computed(function() {
    return [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
  }),
    
  passengerTypes: computed(function() {
    return [ 'pilot', 'passenger', 'none' ];
  }),
    
  @action
  save() {
    let api = this.gameApi;
    api.requestOne('updateCombatant', 
    {
      id: this.get('model.id'), 
      team: this.get('model.team'),
      stance: this.get('model.stance'),
      weapon: this.get('model.weapon'),
      armor: this.get('model.armor'),
      vehicle: this.get('model.vehicle'),
      passenger_type: this.get('model.passenger_type'),
      action: this.get('model.action'),
      action_args: this.get('model.action_args'),
      npc_skill: this.get('model.npc_skill'),
      weapon_specials: this.get('model.weapon_specials') || [],
      armor_specials: this.get('model.armor_specials') || []
    }, null )
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('combat', this.get('model.combat'));
      this.flashMessages.success('Combatant saved!');
    });
  },
        
  @action
  teamChanged(team) {
    this.set('model.team', team);
  },
        
  @action
  stanceChanged(stance) {
    this.set('model.stance', stance);
  },
        
  @action
  weaponChanged(weapon) {
    this.set('model.weapon', weapon);
  },
        
  @action
  armorChanged(armor) {
    this.set('model.armor', armor);
  },
        
  @action
  npcChanged(npc) {
    this.set('model.npc_skill', npc);
  },
        
  @action
  passengerTypeChanged(type) {
    this.set('model.passenger_type', type);
  },
        
  @action
  actionChanged(action) {
    this.set('model.action', action);
    this.set('model.action_args', '');
  },
        
  @action
  addTarget(target) {
    this.set('model.action_args', `${this.model.action_args || ''} ${target}`);
  },
        
  @action
  removeCombatant() {
    this.hideActionConfirmation();
    let api = this.gameApi;
    api.requestOne('removeCombatant', { name: this.get('model.name'), id: this.get('model.combat') }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('combat', this.get('model.combat'));
      this.flashMessages.success('Combatant removed!');
    });
  }
});