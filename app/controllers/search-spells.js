import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  searchName: '',
  searchLevel: '',
  searchSchool: '',
  searchEffect: '',
  searchDesc: '',
  searchAvailable: '',
  searchPotion: '',
  searchResults: null,

  resetOnExit: function() {
    this.set('searchName', '');
    this.set('searchLevel', '');
    this.set('searchSchool', '');
    this.set('searchEffect', '');
    this.set('searchDesc', '');
    this.set('searchAvailable', '');
    this.set('searchPotion', '');
    this.set('searchResults', null);
  },

  actions: {
    reset() {
      this.resetOnExit();
    },
    search() {
      let api = this.get('gameApi');

      api.requestMany('searchSpells', {
        searchName: this.get('searchName'),
        searchLevel: this.get('searchLevel'),
        searchSchool: this.get('searchSchool'),
        searchEffect: this.get('searchEffect'),
        searchDesc: this.get('searchDesc'),
        searchAvailable: this.get('searchAvailable'),
        searchPotion: this.get('searchPotion')
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
