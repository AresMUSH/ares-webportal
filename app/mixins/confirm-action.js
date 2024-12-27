import Mixin from '@ember/object/mixin';
import { action } from '@ember/object';

export default Mixin.create({
  actionConfirmationVisible: false,
  
  @action
  showActionConfirmation() {
    this.set('actionConfirmationVisible', true);
  },
  
  @action
  hideActionConfirmation() {
    this.set('actionConfirmationVisible', false);
  }

});
