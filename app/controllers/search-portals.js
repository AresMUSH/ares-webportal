import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  searchName: '',
  searchSchool: '',
  searchText: '',
  searchKnown: true,

  resetOnExit: function() {
    this.set('searchName', '');
    this.set('searchSchool', '');
    this.set('searchText', '');
    this.set('searchKnown', false);
    this.set('searchResults', null);
  },

  actions: {
    reset() {
      this.resetOnExit();
    },

    schoolChanged(new_schools) {
      this.set('searchSchool', new_schools);

    },


    search() {
      let api = this.get('gameApi');

      api.requestMany('searchPortals', {
        searchName: this.get('searchName'),
        searchSchool: this.get('searchSchool'),
        searchText: this.get('searchText'),
        searchKnown: this.get('searchKnown')
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
