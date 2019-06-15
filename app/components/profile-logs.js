import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  gameApi: service(),
  filter: 'Recent',
  page: 1,
  
  resetOnExit: function() {
    this.set('filter', 'Recent');
    this.set('page', 1);
  },
  
  updateScenesList: function() {
    let api = this.get('gameApi');
    api.requestOne('scenes', {
       filter: this.get('filter'), 
       page: this.get('page'),
       char_id: this.get('char.id') })
    .then( (response) => {
        if (response.error) {
          return;
        }
        this.set('scenes', response);
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
