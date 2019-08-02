import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  actions: {
    switchAlt: function(alt) {
      this.session.authenticate('authenticator:ares', { name: alt, password: 'ALT' })
       .then(() => {
         window.location.replace('/');
       });
    }
  }
});
