import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  searchTitle: '',
  searchTag: '',
  searchText: '',
  searchCategory: '',
  searchResults: null,
    
  resetOnExit: function() {
    this.set('searchTitle', '');
    this.set('searchTag', '');
    this.set('searchText', '');
    this.set('searchCategory', '');
    this.set('searchResults', null);
  },
    
  actions: {
    reset() {
      this.resetOnExit();
    },
    search() {
      let api = this.gameApi;
            
      api.requestMany('searchWiki', { 
        searchTitle: this.searchTitle,
        searchText: this.searchText,
        searchTag: this.searchTag,
        searchCategory: this.searchCategory,
      })
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.set('searchResults', response);
      });
    }
  }
});