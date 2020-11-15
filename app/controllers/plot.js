import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    confirmDelete: false,
    filter: 'All',
    page: 1,
  
    resetOnExit: function() {
      this.set('confirmDelete', false);
      this.set('filter', 'All');
      this.set('page', 1);
    },
    
    updateScenesList: function() {
      let api = this.gameApi;
      api.requestOne('scenes', {
         plot_id: this.model.plot.id,
         filter: this.filter, 
         page: this.page })
      .then( (response) => {
          if (response.error) {
            return;
          }
          this.set('model.scenes', response);
      });
    },
    
    actions: {
        delete() {
            let api = this.gameApi;
            this.set('confirmDelete', false);
            api.requestOne('deletePlot', { id: this.get('model.plot.id')})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('plots');
                this.flashMessages.success('Plot deleted!');
            });
        },
        filterChanged(newFilter) {
          this.set('filter', newFilter);
          this.set('page', 1);
          this.updateScenesList();
        },
        goToPage(newPage) { 
          this.set('page', newPage);
          this.updateScenesList();
        }
    }
});