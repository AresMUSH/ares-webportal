import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  tagName: '',
  
  @action
  rolesChanged(roles) {
    this.set('model.char.roles', roles);
  }
});
