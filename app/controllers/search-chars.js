import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  searchGroups: null,
  searchDemographics: null,
  searchName: '',
  searchTag: '',
  searchResults: null,

  init: function() {
    this._super(...arguments);
    this.set('searchGroups', {});
    this.set('searchDemographics', {});
  },
      
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
      let api = this.gameApi;
            
      api.requestMany('searchChars', { 
        searchGroups: this.searchGroups,
        searchDemographics: this.searchDemographics,
        searchTag: this.searchTag,
        searchName: this.searchName,
        searchRelation: this.searchRelation
      }, null)
      .then( (response) => {
        if (response.error) {
          this.flashMessages.error("Oops!  Something went wrong when the website talked to the game.  Please try again and alert staff if the problem persists.");          
          return;
        }
        this.set('searchResults', response);
      });
    }
  }
});