import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  
  @action
  goToPage(newPage) { 
    this.onGoToPage(newPage);
  }
});
