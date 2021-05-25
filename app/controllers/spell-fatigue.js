import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  gameApi: service(),
  gameSocket: service(),
  flashMessages: service(),
  level_1: '',
  level_2: '',
  level_3: '',
  level_4: '',
  level_5: '',
  level_6: '',
  level_7: '',
  level_8: '',
  level_9: '',
  // mathResults: null,

  resetOnExit: function() {
    this.set('level_1', '');
    this.set('level_2', '');
    this.set('level_3', '');
    this.set('level_4', '');
    this.set('level_5', '');
    this.set('level_6', '');
    this.set('level_7', '');
    this.set('level_8', '');
    this.set('level_9', '');
    this.set('mathResults', null);
  },


  actions: {
    reset() {
      this.resetOnExit();
    },

    do_math() {
      let api = this.get('gameApi');

      api.requestOne('calculateSpellFatigue', {
        level_1: this.get('level_1'),
        level_2: this.get('level_2'),
        level_3: this.get('level_3'),
        level_4: this.get('level_4'),
        level_5: this.get('level_5'),
        level_6: this.get('level_6'),
        level_7: this.get('level_7'),
        level_8: this.get('level_8'),
        level_9: this.get('level_9')
      }, null)
      .then( (response) => {
        if (response.error) {
          this.get('flashMessages').error("Oops!  Something went wrong when the website talked to the game.  Please try again and alert staff is the problem persists.");
          return;
        }
        this.set('mathResults', response);
      });
    }
  }
});
