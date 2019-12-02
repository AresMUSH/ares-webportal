import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  searchLog: '',
  searchParticipant: '',
  searchLocation: '',
  searchTitle: '',
  searchTag: '',
  searchType: 'All',
  searchDate: '',
  searchResults: null,
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
    this.set('page', 1);
  },
  
  updateScenesList: function() {
    let api = this.gameApi;
          
    api.requestOne('searchScenes', { 
      searchLog: this.searchLog,
      searchParticipant: this.searchParticipant,
      searchTitle: this.searchTitle,
      searchTag: this.searchTag,
      searchDate: this.searchDate,
      searchType: this.searchType,
      searchLocation: this.searchLocation,
      page: this.page
    }, null)
    .then( (response) => {
      if (response.error) {
        this.flashMessages.error("Oops!  Something went wrong when the website talked to the game.  Please try again and alert staff if the problem persists.");          
        return;
      }
      this.set('searchResults', response);
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