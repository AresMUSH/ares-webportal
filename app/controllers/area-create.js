import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend(AuthenticatedController, {
  gameApi: service(),
  flashMessages: service(),
  router: service(),
  name: '',
  summary: '',
  description: '',
  parentArea: null,

  resetOnExit: function() {
    this.set('name', '');
    this.set('description', '');
    this.set('summary', '');
    this.set('parent_area', null);
  },  
    
  @action
  changeParent(area) {
    this.set('parentArea', area);
  },
      
  @action
  save() {
    let api = this.gameApi;
    api.requestOne('createArea', 
    { 
      name: this.get('name'), 
      description: this.get('description'),
      summary: this.get('summary'),
      parent_id: this.get('parentArea.id')
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('area', response.id);
      this.flashMessages.success('Area created!');
    });
  }
});