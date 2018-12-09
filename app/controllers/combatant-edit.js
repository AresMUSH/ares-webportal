import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),

    teams: function() {
        return [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
    }.property(),
    
    actions: {
        save: function() {
            let api = this.get('gameApi');
            api.requestOne('updateCombatant', { id: this.get('model.id'), 
                team: this.get('model.team'),
                stance: this.get('model.stance'),
                weapon: this.get('model.weapon'),
                armor: this.get('model.armor'),
                npc_skill: this.get('model.npc_skill'),
                weapon_specials: this.get('model.weapon_specials') || [],
                armor_specials: this.get('model.armor_specials') || []
             }, null )
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('combat', this.get('model.combat'));
                this.get('flashMessages').success('Combatant saved!');
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
    }
});