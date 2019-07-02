import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),
    newCombatantName: '',
    newCombatantType: 'Soldier',
    confirmRemoveCombatant: false,
    
    pageTitle: function() {
        return `Combat ${this.get('model.id')}`;
    }.property(),
    
    resetOnExit: function() {
        this.set('newCombatantName', '');
        this.set('newCombatantType', '');
        this.set('confirmRemoveCombatant', false);
    },
    
    addToCombat(name, type) {
      if (name.length === 0) {
          this.get('flashMessages').danger('Name is required.');
          return;
      } 
      if (!type) {
        this.get('flashMessages').danger('You must select a type.');
        return
      }
      
      let api = this.get('gameApi');
          api.requestOne('addCombatant', { id: this.get('model.id'), 
             name: name,
             combatant_type: type }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              let combatant = response;
              let found = false;
              this.get('model.teams').forEach(t => {
                if (t.team == combatant.team) {
                  found = true;
                  Ember.get(t, 'combatants').pushObject(combatant);
                }            
              })
              if (!found) { 
                this.get('model.teams').pushObject({ team: combatant.team, combatants: [ combatant ]});
              }
              this.get('flashMessages').success('Combatant added!');
          });
    },
    
    removeFromCombat(name) {
      let api = this.get('gameApi');
      api.requestOne('removeCombatant', { name: name, id: this.get('model.id') }, null)
      .then( (response) => {
          if (response.error) {
              return;
          }
          this.get('model.teams').forEach(t => {
            let combatant = t.combatants.find(c => c.name === name);
            if (combatant) {
              Ember.get(t, 'combatants').removeObject(combatant);
            }            
          })
          this.get('flashMessages').success('Combatant removed!');
      });
    },
    
    actions: {
        addCombatant: function() {
          let name = this.get('newCombatantName');
          let type = this.get('newCombatantType');
          this.addToCombat(name, type);            
        },
        joinCombat: function() {
          let name = this.get('currentUser.name')
          let type = this.get('newCombatantType');
          this.addToCombat(name, type);            
        },
        newTurn: function() {
            let api = this.get('gameApi');
            api.requestOne('newCombatTurn', { id: this.get('model.id') }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.get('flashMessages').success('Combat turn started!');
            });
            
        },
        leaveCombat: function() {
          let name = this.get('currentUser.name')
          this.removeFromCombat(name);
        },
        removeCombatant: function(name) {
          this.set('confirmRemoveCombatant', false);
          this.removeFromCombat(name);
        },
        combatantTypeChanged: function(type) {
            this.set('newCombatantType', type);
        }
    }
});