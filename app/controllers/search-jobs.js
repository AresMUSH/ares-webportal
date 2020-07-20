import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  gameSocket: service(),
  flashMessages: service(),
  
  searchText: '',
  searchTitle: '',
  searchStatus: '',
  searchCategory: '',
  searchSubmitter: '',
  searchResults: null,
  searchInProgress: false,
    
  resetOnExit: function() {
    this.set('searchText', '');
    this.set('searchTitle', '');
    this.set('searchCategory', '');
    this.set('searchStatus', '');
    this.set('searchSubmitter', '');
    this.set('searchResults', null);
    this.set('searchInProgress', false);
  },
  
  onSearchResults: function(type, msg, timestamp ) {
      let splitMsg = msg.split('|');
      let searchType = splitMsg[0];       
      let searchToken = splitMsg[1];
      let data = splitMsg[2];
      let currentUsername = this.get('currentUser.name');
      
      if (data) {
        data = JSON.parse(data);
      }
      if (searchType != 'jobs' || searchToken != this.searchInProgress) {
        return;
      }
      this.set('searchInProgress', false);
      this.set('searchResults', data);
  },
  
  setupCallback: function() {
      let self = this;
      this.gameSocket.setupCallback('search_results', function(type, msg, timestamp) {
          self.onSearchResults(type, msg, timestamp) } );
  },
    
  actions: {
    reset() {
      this.resetOnExit();
    },
    search() {
      let api = this.gameApi;
      this.set('searchInProgress', Math.floor(Math.random() * 10000));      
      this.set('searchResults', null);
            
      api.requestOne('searchJobs', { 
        searchSubmitter: this.searchSubmitter,
        searchTitle: this.searchTitle,
        searchText: this.searchText,
        searchCategory: this.searchCategory,
        searchStatus: this.searchStatus,
        searchToken: this.searchInProgress      
      })
      .then( (response) => {
        if (response.error) {
          this.set('searchInProgress', false);
          return;
        }
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