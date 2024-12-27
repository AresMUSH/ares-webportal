import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  tagName: '',
  
  @action
  reloadChar() {
    this.onReloadChar();
  }
});
