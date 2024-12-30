import $ from "jquery"
import { get, computed } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { action } from '@ember/object';
import { removeObject } from 'ares-webportal/helpers/object-ext';

export default Controller.extend(AuthenticatedController, {
  gameApi: service(),
  gameSocket: service(),
  flashMessages: service(),
  router: service(),
  newCombatantName: '',
  newCombatantType: '',
  newCombatActivity: false,
  showAddCombatant: false,
  showJoinCombat: false,
  confirmStopCombat: false,
  confirmRemoveCombatant: false,
  commandResponse: '',
  combatCommand: '',
  combatLog: '',
    
  pageTitle: computed('model.id', function() {
    return `Combat ${this.get('model.id')}`;
  }),
    
  onCombatActivity: function(type, msg, timestamp ) {
      
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
        this.set('combatLog', this.combatLog + message);
        this.scrollLog();
      }
        
    }
  },
  
  scrollLog: function() {
    try {
      $('#combat-log').stop().animate({
        scrollTop: $('#combat-log')[0].scrollHeight
      }, 800); 
    }
    catch(error) {
      // This happens sometimes when transitioning away from screen.
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
    this.set('combatCommand', '');
    this.set('commandResponse', '');
  },
  
  setupController: function(model) {
    this.set('combatLog', model.messages);
  },
  
  setupCallback: function() {
    let self = this;
    this.gameSocket.setupCallback('combat_activity', function(type, msg, timestamp) {
      self.onCombatActivity(type, msg, timestamp) 
    } );
    this.gameSocket.setupCallback('new_combat_turn', function(type, msg, timestamp) {
      self.onCombatActivity(type, msg, timestamp) 
    } );
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
    api.requestOne('addCombatant', 
    {
      id: this.get('model.id'), 
      name: name,
      combatant_type: type
    }, null)
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
          removeObject(get(t, 'combatants'), combatant, t, 'combatants');
        }
      });
      if (isCurrentUser) {
        this.set('model.in_combat', false);
      }
      this.flashMessages.success('Combatant removed!');
    });
  },
    
  @action
  addCombatant() {
    let name = this.newCombatantName;
    let type = this.newCombatantType;
    this.set('showAddCombatant', false);
    if (type === '') {
      this.flashMessages.danger('You must select a combatant type.');
      return;
    }
    this.addToCombat(name, type, false);            
  },
      
  @action
  joinCombat() {
    let name = this.get('currentUser.name')
    let type = this.newCombatantType;
    this.set('showJoinCombat', false);
    if (type === '') {
      this.flashMessages.danger('You must select a combatant type.');
      return;
    }
    this.addToCombat(name, type, true);            
  },
      
  @action
  newTurn() {
    let api = this.gameApi;
    api.requestOne('newCombatTurn', { combat_id: this.get('model.id') }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.flashMessages.success('Combat turn started!');
    });
            
  },
      
  @action
  leaveCombat() {
    let name = this.get('currentUser.name')
    this.removeFromCombat(name, true);
  },
      
  @action
  removeCombatant(name) {
    this.set('confirmRemoveCombatant', false);
    this.removeFromCombat(name, false);
  },
      
  @action
  combatantTypeChanged(type) {
    this.set('newCombatantType', type);
  },
      
  @action
  stopCombat() {
    this.set('confirmStopCombat', false);
    let api = this.gameApi;
    api.requestOne('stopCombat', { id: this.get('model.id') })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.flashMessages.success('Combat stopped!');
      this.router.transitionTo('combats');
    });
  },
      
  @action
  aiActions() {
    let api = this.gameApi;
    api.requestOne('combatAiActions', { id: this.get('model.id') })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.flashMessages.success('Actions set!');
    });
  },
      
  @action
  sendCommand() {
    let api = this.gameApi;
        
    let command = this.combatCommand;
    this.set('commandResponse', '');
    this.set('combatCommand', '');
        
    api.requestOne('sendCombatCommand', { combat_id: this.get('model.id'), command: command })
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
  },
      
  @action
  jumpToEnd() {
    this.scrollLog();
  },
  
  @action
  setConfirmStopCombat(value) {
    this.set('confirmStopCombat', value);
  },
  
  @action
  setShowAddCombatant(value) {
    this.set('showAddCombatant', value);
  },
  
  @action
  setShowJoinCombat(value) {
    this.set('showJoinCombat', value);
  }
});