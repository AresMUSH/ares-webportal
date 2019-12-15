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
            api.requestOne('updateCombatant', { id: this.get('model.id'), 
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
                this.transitionToRoute('combat', this.get('model.combat'));
                this.flashMessages.success('Combatant saved!');
            });
        },
        teamChanged: function(team) {
            this.set('model.team', team);
        },
        stanceChanged: function(stance) {
            this.set('model.stance', stance);
        },
        weaponChanged: function(weapon) {
            this.set('model.weapon', weapon);
        },
        armorChanged: function(armor) {
            this.set('model.armor', armor);
        },
        npcChanged: function(npc) {
            this.set('model.npc_skill', npc);
        },
        passengerTypeChanged: function(type) {
          this.set('model.passenger_type', type);
        },
        actionChanged: function(action) {
            this.set('model.action', action);
            this.set('model.action_args', '');
        },
    }
});