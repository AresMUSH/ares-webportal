import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  filter: 'All',
  page: 1,

  resetOnExit: function() {
    this.set('filter', 'All');
    this.set('page', 1);
  },

  updateScenesList: function() {
    let api = this.gameApi;
    api.requestOne('scenes', {
       filter: this.filter,
       page: this.page })
    .then( (response) => {
        if (response.error) {
          return;
        }
        this.set('model.portal.scenes', response.scenes);
    });
  },

  actions: {
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
