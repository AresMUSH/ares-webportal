import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  searchText: '',
  searchResults: null,
    
  resetOnExit: function() {
    this.set('searchText', '');
    this.set('searchResults', null);
  },
    
  @action
  reset() {
    this.resetOnExit();
  },
    
  @action
  search() {
    let api = this.gameApi;
            
    api.requestOne('searchHelp', 
    { 
      searchText: this.searchText
    })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.set('searchResults', response);
    });
  }
});