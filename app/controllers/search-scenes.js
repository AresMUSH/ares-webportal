import Controller from '@ember/controller';
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
    let api = this.get('gameApi');
          
    api.requestOne('searchScenes', { 
      searchLog: this.get('searchLog'),
      searchParticipant: this.get('searchParticipant'),
      searchTitle: this.get('searchTitle'),
      searchTag: this.get('searchTag'),
      searchDate: this.get('searchDate'),
      searchType: this.get('searchType'),
      searchLocation: this.get('searchLocation'),
      page: this.get('page')
    }, null)
    .then( (response) => {
      if (response.error) {
        this.get('flashMessages').error("Oops!  Something went wrong when the website talked to the game.  Please try again and alert staff is the problem persists.");          
        return;
      }
      this.set('searchResults', response);
    });
  },
  
  sceneTypes: function() {
    let types = this.get('model.sceneTypes');
    let scene_types = types.map(s => s.name);
    let base_filters = ['Recent', 'All', 'Popular'];
    return base_filters.concat(scene_types);
    }.property('model.sceneTypes'),
  
  actions: {
    goToPage(newPage) { 
      this.set('page', newPage);
      this.updateScenesList();
    },
    
    reset() {
      this.resetOnExit();
    },
    search() {
      this.updateScenesList();
    },
    sceneTypeChanged(sceneType) {
      this.set('searchType', sceneType);
      
    }
  }
});