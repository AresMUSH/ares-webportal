import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    newCombatantName: '',
    newCombatantType: 'Soldier',
    
    resetOnExit: function() {
        this.set('newCombatantName', '');
        this.set('newCombatantType', '');
    },
    
    actions: {
        addCombatant: function() {
            let name = this.get('newCombatantName');
            if (name.length === 0) {
                this.get('flashMessages').danger('Name is required.');
            } else {
                let api = this.get('gameApi');
                api.requestOne('addCombatant', { id: this.get('model.id'), 
                   name: this.get('newCombatantName'),
                   combatant_type: this.get('newCombatantType') }, null)
                .then( (response) => {
                    if (response.error) {
                        return;
                    }
                    this.send('reloadModel');
                    this.get('flashMessages').success('Combatant added!');
                });
            }
            
        },
        combatantTypeChanged: function(type) {
            this.set('newCombatantType', type);
        }
    }
});