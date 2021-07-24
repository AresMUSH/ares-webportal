import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
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
  
    actions: {        
        save: function() {
          let api = this.gameApi;
          api.requestOne('jobCategoryCreate', { id: this.id,
             name: this.name, 
             color: this.color,
             template: this.template,
             roles: (this.roles || [])}, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.transitionToRoute('jobcat-manage');
              this.flashMessages.success('Job category created!');
          });
        },
        
        rolesChanged: function(roles) {
          this.set('roles', roles);
        }
    }
    
});