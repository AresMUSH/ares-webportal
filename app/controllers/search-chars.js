import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  searchGroups: {},
  searchDemographics: {},
  searchName: '',
  searchTag: '',
  searchResults: null,
    
  resetOnExit: function() {
    this.set('searchGroups', {});
    this.set('searchDemographics', {});
    this.set('searchName', '');
    this.set('searchTag', '');
    this.set('searchResults', null);
  },
    
  actions: {
    reset() {
      this.resetOnExit();
    },
    search() {
      let api = this.get('gameApi');
            
      api.requestMany('searchChars', { 
        searchGroups: this.get('searchGroups'),
        searchDemographics: this.get('searchDemographics'),
        searchTag: this.get('searchTag'),
        searchName: this.get('searchName')
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