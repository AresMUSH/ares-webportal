import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import ConfirmAction from 'ares-webportal/mixins/confirm-action';

export default Controller.extend(AuthenticatedController, ConfirmAction, {
  gameApi: service(),
  router: service(),
  filter: 'All',
  page: 1,
  
  resetOnExit: function() {
    this.set('filter', 'All');
    this.set('page', 1);
    this.hideActionConfirmation();
  },
    
  updateScenesList: function() {
    let api = this.gameApi;
    api.requestOne('scenes', 
    {
      plot_id: this.model.plot.id,
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
  delete() {
    let api = this.gameApi;
    this.hideActionConfirmation();
    api.requestOne('deletePlot', { id: this.get('model.plot.id')})
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('plots');
      this.flashMessages.success('Plot deleted!');
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