import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
  gameApi: service(),
  gameSocket: service(),
  flashMessages: service(),
  newCombatantName: '',
  newCombatantType: 'Soldier',
  newCombatActivity: false,
  showAddCombatant: false,
  showJoinCombat: false,
  confirmStopCombat: false,
  confirmRemoveCombatant: false,
  combatLog: '',
    
  pageTitle: function() {
    return `Combat ${this.get('model.id')}`;
  }.property(),
    
  onCombatActivity: function(type, msg, timestamp) {
      
    let splitMsg = msg.split('|');
    let combatId = splitMsg[0];       
    let message = splitMsg[1];
      
    if (combatId === this.get('model.id')) {

      if (type == 'new_combat_turn') {
        this.set('newCombatActivity', false);
        let teams = JSON.parse(message);
        this.set('model.teams', teams);
      }
      else {
        this.set('newCombatActivity', true);
        this.set('combatLog', this.get('combatLog') + "\n" + message);
        try {
          $('#combat-log').stop().animate({
            scrollTop: $('#combat-log')[0].scrollHeight
          }, 800); 
        }
        catch(error) {
          // This happens sometimes when transitioning away from screen.
        }   
      }
        
    }
  },
    
  resetOnExit: function() {
    this.set('newCombatantName', '');
    this.set('newCombatantType', '');
    this.set('confirmRemoveCombatant', false);
    this.set('showAddCombatant', false);
    this.set('newCombatActivity', false);
    this.set('showJoinCombat', false);
    this.set('confirmStopCombat', false);
    this.set('combatLog', '');
  },
    
  setupCallback: function() {
    let self = this;
    this.get('gameSocket').setupCallback('combat_activity', function(type, msg, timestamp) {
        self.onCombatActivity(type, msg, timestamp) } );
    this.get('gameSocket').setupCallback('new_combat_turn', function(type, msg, timestamp) {
        self.onCombatActivity(type, msg, timestamp) } );
    },
    
    addToCombat(name, type, isCurrentUser) {
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
        this.set('model', response);
        if (isCurrentUser) {
          this.set('model.in_combat', true);
        }
        this.get('flashMessages').success('Combatant added!');
      });
    },
    
    removeFromCombat(name, isCurrentUser) {
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
        });
        if (isCurrentUser) {
          this.set('model.in_combat', false);
        }
        this.get('flashMessages').success('Combatant removed!');
      });
    },
    
    actions: {
      addCombatant: function() {
        let name = this.get('newCombatantName');
        let type = this.get('newCombatantType');
        this.set('showAddCombatant', false);
        this.addToCombat(name, type, false);            
      },
      joinCombat: function() {
        let name = this.get('currentUser.name')
        let type = this.get('newCombatantType');
        this.set('showJoinCombat', false);
        this.addToCombat(name, type, true);            
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
        this.removeFromCombat(name, true);
      },
      removeCombatant: function(name) {
        this.set('confirmRemoveCombatant', false);
        this.removeFromCombat(name, false);
      },
      combatantTypeChanged: function(type) {
        this.set('newCombatantType', type);
      },
      stopCombat: function() {
        this.set('confirmStopCombat', false);
        let api = this.get('gameApi');
        api.requestOne('stopCombat', { id: this.get('model.id') }, null)
        .then( (response) => {
          if (response.error) {
            return;
          }
          this.get('flashMessages').success('Combat stopped!');
          this.transitionToRoute('combats');
        });
      }
    }
  });