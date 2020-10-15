import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  
  actions: {
    rolesChanged(roles) {
      this.set('model.char.roles', roles);
    }
  }
});
