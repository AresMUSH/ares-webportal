import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  searchName: '',
  searchArea: '',
  searchOwner: '',
  searchResults: null,
    
  resetOnExit: function() {
    this.set('searchName', '');
    this.set('searchArea', '');
    this.set('searchOwner', '');
    this.set('searchResults', null);
  },
    
  @action
  reset() {
    this.resetOnExit();
  },
    
  @action
  search() {
    let api = this.gameApi;
            
    api.requestMany('searchLocations', 
    { 
      searchArea: this.searchArea,
      searchName: this.searchName,
      searchOwner: this.searchOwner
    }, null)
    .then( (response) => {
      if (response.error) {
        this.flashMessages.error("Oops!  Something went wrong when the website talked to the game.  Please try again and alert staff if the problem persists.");          
        return;
      }
      this.set('searchResults', response);
    });
  }
});