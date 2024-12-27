import Mixin from '@ember/object/mixin';
import { action } from '@ember/object';

export default Mixin.create({
  @action
  reloadModel() {
    this.refresh();
  }        
});
