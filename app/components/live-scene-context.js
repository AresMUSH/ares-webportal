import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  showSceneDetails: false,
  
  @action
  toggleSceneDetails() {
    this.set("showSceneDetails", !this.showSceneDetails);
  }
});
