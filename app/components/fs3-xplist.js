import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
   
  @action
  learnAbility(ability) {
    this.onLearnAbility(ability);
  }
});
