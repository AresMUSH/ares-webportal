import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  gameApi: service(),
  gameSocket: service(),
  flashMessages: service(),
  
  searchText: '',
  searchTitle: '',
  searchStatus: '',
  searchCategory: '',
  searchSubmitter: '',
  searchTag: '',
  searchResults: null,
  searchInProgress: false,
  searchCustom: '',
    
  resetOnExit: function() {
    this.set('searchText', '');
    this.set('searchTitle', '');
    this.set('searchCategory', '');
    this.set('searchStatus', '');
    this.set('searchSubmitter', '');
    this.set('searchTag', '');
    this.set('searchResults', null);
    this.set('searchInProgress', false);
    this.set('searchCustom', this.get('model.custom_fields'));
  },
  
  setup: function(model) {
    this.set('searchCustom', this.get('model.custom_fields'));
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
      self.onSearchResults(type, msg, timestamp) 
    } );
  },
  
  @action  
  changeCustomDropdown(id, val) {
    this.set(`searchCustom.${id}.search`, val);
  },
    
  @action
  reset() {
    this.resetOnExit();
  },
    
  @action
  search() {
    let api = this.gameApi;
    this.set('searchInProgress', Math.floor(Math.random() * 10000));      
    this.set('searchResults', null);
            
    api.requestOne('searchJobs', 
    { 
      searchSubmitter: this.searchSubmitter,
      searchTitle: this.searchTitle,
      searchText: this.searchText,
      searchCategory: this.searchCategory,
      searchStatus: this.searchStatus,
      searchToken: this.searchInProgress,
      searchTag: this.searchTag,
      searchCustom: this.searchCustom
    })
    .then( (response) => {
      if (response.error) {
        this.set('searchInProgress', false);
        return;
      }
    });
  },
    
  @action
  changeSearchStatus(status) {
    this.set('searchStatus', status);
  },
    
  @action
  changeSearchCategory(cat) {
    this.set('searchCategory', cat);
  }
});