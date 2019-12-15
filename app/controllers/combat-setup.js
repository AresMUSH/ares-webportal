import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),

    teams: computed(function() {
        return [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    }),
    
    passengerTypes: computed(function() {
      return [ 'pilot', 'passenger', 'none' ];
    }),
    
    actions: {
        save: function() {
            let api = this.gameApi;
            api.requestOne('saveCombatSetup', { id: this.get('model.id'), 
                combatants: this.get('model.combatants')
             }, null )
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('combat', this.get('model.id'));
                this.flashMessages.success('Combat saved!');
            });
        },
        teamChanged: function(id, team) {
          this.set(`model.combatants.${id}.team`, team);
        },
        stanceChanged: function(id, stance) {
          this.set(`model.combatants.${id}.stance`, stance);
        },
        weaponChanged: function(id, weapon) {
          this.set(`model.combatants.${id}.weapon`, weapon);
        },
        armorChanged: function(id, armor) {
          this.set(`model.combatants.${id}.armor`, armor);
        },
        npcChanged: function(id, skill) {
          this.set(`model.combatants.${id}.npc_skill`, skill);
        },
        passengerTypeChanged: function(id, type) {
          this.set(`model.combatants.${id}.passenger_type`, type);
        },
        actionChanged: function(id, action) {
          this.set(`model.combatants.${id}.action`, action);
          this.set(`model.combatants.${id}.action_args`, '');
        },
    }
});