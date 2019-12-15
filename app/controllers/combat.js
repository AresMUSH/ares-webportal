import $ from "jquery"
import { get, computed } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
  gameApi: service(),
  gameSocket: service(),
  flashMessages: service(),
  newCombatantName: '',
  newCombatantType: '',
  newCombatActivity: false,
  showAddCombatant: false,
  showJoinCombat: false,
  confirmStopCombat: false,
  confirmRemoveCombatant: false,
  combatLog: '',
    
  pageTitle: computed(function() {
    return `Combat ${this.get('model.id')}`;
  }),
    
  onCombatActivity: function(type, msg /* , timestamp */ ) {
      
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
        this.set('combatLog', this.combatLog + "\n" + message);
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
    this.gameSocket.setupCallback('combat_activity', function(type, msg, timestamp) {
        self.onCombatActivity(type, msg, timestamp) } );
    this.gameSocket.setupCallback('new_combat_turn', function(type, msg, timestamp) {
        self.onCombatActivity(type, msg, timestamp) } );
    },
    
    addToCombat(name, type, isCurrentUser) {
      if (name.length === 0) {
        this.flashMessages.danger('Name is required.');
        return;
      } 
      if (!type) {
        this.flashMessages.danger('You must select a type.');
        return
      }
      
      let api = this.gameApi;
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
        this.flashMessages.success('Combatant added!');
      });
    },
    
    removeFromCombat(name, isCurrentUser) {
      let api = this.gameApi;
      api.requestOne('removeCombatant', { name: name, id: this.get('model.id') }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.get('model.teams').forEach(t => {
          let combatant = t.combatants.find(c => c.name === name);
          if (combatant) {
            get(t, 'combatants').removeObject(combatant);
          }
        });
        if (isCurrentUser) {
          this.set('model.in_combat', false);
        }
        this.flashMessages.success('Combatant removed!');
      });
    },
    
    actions: {
      addCombatant: function() {
        let name = this.newCombatantName;
        let type = this.newCombatantType;
        this.set('showAddCombatant', false);
        if (type === '') {
          this.flashMessages.danger('You must select a combatant type.');
          return;
        }
        this.addToCombat(name, type, false);            
      },
      joinCombat: function() {
        let name = this.get('currentUser.name')
        let type = this.newCombatantType;
        this.set('showJoinCombat', false);
        if (type === '') {
          this.flashMessages.danger('You must select a combatant type.');
          return;
        }
        this.addToCombat(name, type, true);            
      },
      newTurn: function() {
        let api = this.gameApi;
        api.requestOne('newCombatTurn', { id: this.get('model.id') }, null)
        .then( (response) => {
          if (response.error) {
            return;
          }
          this.flashMessages.success('Combat turn started!');
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
        let api = this.gameApi;
        api.requestOne('stopCombat', { id: this.get('model.id') }, null)
        .then( (response) => {
          if (response.error) {
            return;
          }
          this.flashMessages.success('Combat stopped!');
          this.transitionToRoute('combats');
        });
      }
    }
  });