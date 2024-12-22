import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Component.extend({
  session: service(),
  showAltSelection: false,
  
  @action
  setAltSelectionVisible(visible) {
    this.set('showAltSelection', visible);
  },
  
  @action
  switchAlt(alt) {
    this.session.authenticate('authenticator:ares', { name: alt, password: 'ALT' })
     .then(() => {
       window.location.replace('/');
     });
  }
});
