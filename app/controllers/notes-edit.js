import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend(AuthenticatedController, {
  gameApi: service(),
  flashMessages: service(),
  router: service(),
    
  @action
  save() {
          
    let notes = {};
    this.get('model.notes').forEach(function(s) {
      notes[s.name.toLowerCase()] = s.notes;
    });
          
    let api = this.gameApi;
    api.requestOne('saveNotes', 
    {
      id: this.get('model.id'),
      notes: notes
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('notes', this.get('model.name'));
      this.flashMessages.success('Notes saved!');
    });
  }
});