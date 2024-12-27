import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { action } from '@ember/object';

export default Controller.extend(AuthenticatedController, {
  gameApi: service(),
  filter: 'Recent',
  page: 1,
  
  resetOnExit: function() {
    this.set('filter', 'Recent');
    this.set('page', 1);
  },
  
  updateScenesList: function() {
    let api = this.gameApi;
    api.requestOne('scenes', 
    {
      filter: this.filter, 
      page: this.page 
    })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.set('model.scenes', response);
    });
  },
  
  @action
  filterChanged(newFilter) {
    this.set('filter', newFilter);
    this.set('page', 1);
    this.updateScenesList();
  },
    
  @action
  goToPage(newPage) { 
    this.set('page', newPage);
    this.updateScenesList();
  }
});