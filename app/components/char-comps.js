import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  flashMessages: service(),
  gameApi: service(),
  filter: 'All',
  page: 1,

  resetOnExit: function() {
    this.set('page', 1);
  },

  updateCompsList: function() {
    let api = this.gameApi;
    api.requestOne('comps', {
      page: this.page,
      char_id: this.get('char.id') })
    .then( (response) => {
        if (response.error) {
          return;
        }
        this.set('char.custom.comps', response);
    });
  },

  actions: {
    reloadChar() {
      this.reloadChar();
    },
    save() {
      let api = this.get('gameApi');
      console.log("Did we get here?1");
      api.requestOne('addComp', {
        char_id: this.get('char.id'),
        comp_msg: this.get('char.comp_msg')
      }, null)
      .then( (response) => {
          if (response.error) {
              return;
          }
        console.log("Did we get here?2")
        this.flashMessages.success('Compliment added!');
        console.log("Did we get here?")
        this.reloadChar();
      });
    },
    goToPage(newPage) {
      this.set('page', newPage);
      this.updateCompsList();
    }
  }
});
