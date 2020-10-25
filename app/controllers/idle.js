import Controller from '@ember/controller';
import { set } from '@ember/object';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    idleAddCharName: '',
    confirmExecute: null,
    idleReport: '',
  
    resetOnExit: function() {
      this.set('idleAddCharName', '');
      this.set('confirmExecute', null);
      this.set('idleReport', null);
    },
  
    destroyingApprovedChars: computed('model.chars.@each.idle_action', function() {
      return this.get('model.chars').any( c => c.approved && c.idle_action === 'Destroy');
    }),
  
    actions: {
      addChar: function() {
        this.get('model.chars').pushObject( { name: this.idleAddCharName, last_on: '----', idle_action: 'Warn' } );
      },
      
      idleActionChanged: function(char, idleAction) {
        set(char, 'idle_action', idleAction);
      },
    
      execute: function() {
        this.set('confirmExecute', null);
        this.set('idleReport', "Processing. Please wait...")
        let api = this.gameApi;
        let chars = [];
        this.get('model.chars').forEach(function(c) { 
          chars.push({
          name: c.name,
          idle_action: c.idle_action,
          notes: c.notes
        }); } );
        api.requestOne('idleExecute', {chars: chars}, null)
        .then( (response) => {
            if (response.error) {
              this.set('idleReport', null);
              return;
            }
            this.set('idleReport', response.report);
        });
      },
      
      removeFromIdle: function(name) {
        let entry = this.get('model.chars').find(c => c.name === name);
        if (entry) {
          this.get('model.chars').removeObject(entry);
        }
      }
    }
    
});