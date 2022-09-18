import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  showCombat: false,
  showCombatCommand: false,
  combatCommand: '',
  tagName: '',
  gameApi: service(),
  flashMessages: service(),

  actions: {
    combatHero: function() {
      let api = this.gameApi;
      api.requestOne('combatHero', { combat_id: this.get('scene.combat.id'), sender: this.get('scene.poseChar.name') }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.set('scene.combat', response);
      });
    },
    
    newTurn: function() {
      let api = this.gameApi;
      api.requestOne('newCombatTurn', { combat_id: this.get('scene.combat.id'), sender: this.get('scene.poseChar.name') }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
      });
          
    },
    
    joinCombat: function() {
      let api = this.gameApi;
      api.requestOne('joinCombat', { combat_id: this.get('scene.combat.id'), sender: this.get('scene.poseChar.name') }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
      });
          
    },
    
    sendCommand: function() {
      let api = this.gameApi;
      
      let command = this.combatCommand;
      this.set('commandResponse', '');
      this.set('combatCommand', '');
      
      api.requestOne('sendCombatCommand', { combat_id: this.get('scene.combat.id'), sender: this.get('scene.poseChar.name'), command: command })
      .then( (response) => {
        if (response.error) {
          return;
        }
        if (response.message) {
          this.set('commandResponse', response.message);
        } else {
          this.set('commandResponse', 'Command sent.');
        }
        this.set('model', response.data);
      });
    }
  }
});
