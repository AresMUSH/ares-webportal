import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  gameApi: service(),
  router: service(),
  name: '',
  desc: '',
  order: '',
  template: '',
  roles: null,

  resetOnExit: function() {
    this.set('name', '');
    this.set('desc', '');
    this.set('order', '');
    this.set('template', '');
    this.set('roles', null);
  },
  
  @action      
  save() {
    let api = this.gameApi;
    api.requestOne('jobCategoryCreate', 
    {
      id: this.id,
      name: this.name, 
      color: this.color,
      template: this.template,
      roles: (this.roles || [])
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('jobcat-manage');
      this.flashMessages.success('Job category created!');
    });
  },
        
  @action
  rolesChanged(roles) {
    this.set('roles', roles);
  }
});