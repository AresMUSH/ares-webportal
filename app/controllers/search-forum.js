import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  searchText: '',
  searchTitle: '',
  searchAuthor: '',
  searchResults: null,
    
  resetOnExit: function() {
    this.set('searchText', '');
    this.set('searchTitle', '');
    this.set('searchAuthor', '');
    this.set('searchResults', null);
  },
    
  @action
  reset() {
    this.resetOnExit();
  },
    
  @action
  search() {
    let api = this.gameApi;
            
    api.requestMany('searchForum', 
    { 
      searchText: this.searchText,
      searchAuthor: this.searchAuthor,
      searchTitle: this.searchTitle
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