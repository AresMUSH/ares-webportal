import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  searchText: '',
  searchTitle: '',
  searchStatus: '',
  searchCategory: '',
  searchSubmitter: '',
  searchResults: null,
    
  resetOnExit: function() {
    this.set('searchText', '');
    this.set('searchTitle', '');
    this.set('searchCategory', '');
    this.set('searchStatus', '');
    this.set('searchSubmitter', '');
    this.set('searchResults', null);
  },
    
  actions: {
    reset() {
      this.resetOnExit();
    },
    search() {
      let api = this.gameApi;
            
      api.requestMany('searchJobs', { 
        searchSubmitter: this.searchSubmitter,
        searchTitle: this.searchTitle,
        searchText: this.searchText,
        searchCategory: this.searchCategory,
        searchStatus: this.searchStatus
      }, null)
      .then( (response) => {
        if (response.error) {
          this.flashMessages.error("Oops!  Something went wrong when the website talked to the game.  Please try again and alert staff if the problem persists.");          
          return;
        }
        this.set('searchResults', response);
      });
    },
    changeSearchStatus(status) {
      this.set('searchStatus', status);
    },
    changeSearchCategory(cat) {
      this.set('searchCategory', cat);
    }
    
  }
});