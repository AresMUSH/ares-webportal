import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  searchLog: '',
  searchParticipant: '',
  searchTitle: '',
  searchTag: '',
  searchDate: '',
  searchResults: null,
    
  resetOnExit: function() {
    this.set('searchLog', '');
    this.set('searchParticipant', '');
    this.set('searchTitle', '');
    this.set('searchTag', '');
    this.set('searchDate', '');
    this.set('searchResults', null);
  },
    
  actions: {
    reset() {
      this.resetOnExit();
    },
    search() {
      let api = this.get('gameApi');
            
      api.requestMany('searchScenes', { 
        searchLog: this.get('searchLog'),
        searchParticipant: this.get('searchParticipant'),
        searchTitle: this.get('searchTitle'),
        searchTag: this.get('searchTag'),
        searchDate: this.get('searchDate')
      }, null)
      .then( (response) => {
        if (response.error) {
          this.get('flashMessages').error("Oops!  Something went wrong when the website talked to the game.  Please try again and alert staff is the problem persists.");          
          return;
        }
        this.set('searchResults', response);
      });
    }
  }
});