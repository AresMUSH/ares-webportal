import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  gameSocket: service(),
  flashMessages: service(),
  searchLog: '',
  searchParticipant: '',
  searchLocation: '',
  searchTitle: '',
  searchTag: '',
  searchType: 'All',
  searchDate: '',
  searchResults: null,
  searchInProgress: false,
  page: 1,
    
  resetOnExit: function() {
    this.set('searchLog', '');
    this.set('searchParticipant', '');
    this.set('searchTitle', '');
    this.set('searchTag', '');
    this.set('searchType', 'All');
    this.set('searchDate', '');
    this.set('searchLocation', '');
    this.set('searchResults', null);
    this.set('searchInProgress', false);
    this.set('page', 1);
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
      if (searchType != 'scenes' || searchToken != this.searchInProgress) {
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
  
  updateScenesList: function() {
    let api = this.gameApi;
    this.set('searchResults', null);
    this.set('searchInProgress', Math.floor(Math.random() * 10000));      
    api.requestOne('searchScenes', { 
      searchLog: this.searchLog,
      searchParticipant: this.searchParticipant,
      searchTitle: this.searchTitle,
      searchTag: this.searchTag,
      searchDate: this.searchDate,
      searchType: this.searchType,
      searchLocation: this.searchLocation,
      page: this.page,
      searchToken: this.searchInProgress
    })
    .then( (response) => {
      if (response.error) {
        this.set('searchInProgress', false);
        return;
      }
    });
  },
  
  sceneTypes: computed(function() {
    let types = this.get('model.sceneTypes');
    let scene_types = types.map(s => s.name);
    let base_filters = ['Recent', 'All', 'Popular'];
    return base_filters.concat(scene_types);
    }),
  
  actions: {
    goToPage(newPage) { 
      this.set('page', newPage);
      this.updateScenesList();
    },
    
    reset() {
      this.resetOnExit();
    },
    search() {
      this.set('page', 1);
      this.updateScenesList();
    },
    sceneTypeChanged(sceneType) {
      this.set('searchType', sceneType);
      
    }
  }
});