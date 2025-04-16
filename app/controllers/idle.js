import Controller from '@ember/controller';
import { set } from '@ember/object';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import ConfirmAction from 'ares-webportal/mixins/confirm-action';
import { pushObject, removeObject } from 'ares-webportal/helpers/object-ext';

export default Controller.extend(ConfirmAction, {
  gameApi: service(),
  flashMessages: service(),
  idleAddCharName: '',
  idleReport: '',
  
  resetOnExit: function() {
    this.set('idleAddCharName', '');
    this.set('idleReport', null);
    this.hideActionConfirmation();
  },
  
  destroyingApprovedChars: computed('model.chars.@each.idle_action', function() {
    return this.get('model.chars').some( c => c.approved && c.idle_action === 'Destroy');
  }),
  
  @action
  addChar() {
    pushObject(this.get('model.chars'), { name: this.idleAddCharName, last_on: '----', idle_action: 'Warn' }, this.model, 'chars');
  },
      
  @action
  idleActionChanged(char, idleAction) {
    set(char, 'idle_action', idleAction);
  },
    
  @action
  execute() {
    this.hideActionConfirmation();
    this.set('idleReport', "Processing. Please wait...")
    let api = this.gameApi;
    let chars = [];
    this.get('model.chars').forEach(function(c) { 
      chars.push({
        name: c.name,
        idle_action: c.idle_action,
        notes: c.notes
      }); 
    } );
    api.requestOne('idleExecute', {chars: chars}, null)
    .then( (response) => {
      if (response.error) {
        this.set('idleReport', null);
        return;
      }
      this.set('idleReport', response.report);
    });
  },
      
  @action
  removeFromIdle(name) {
    let entry = this.get('model.chars').find(c => c.name === name);
    if (entry) {
      removeObject(this.get('model.chars'), entry, this.model, 'chars');
    }
  }
    
});