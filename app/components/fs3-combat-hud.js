import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({  
  damagePopupChar: null,
  
  @action
  showDamage(char) {
    this.set('damagePopupChar', char);
  }
});
