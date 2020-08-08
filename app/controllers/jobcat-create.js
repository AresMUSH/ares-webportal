import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    name: '',
    desc: '',
    order: '',
    template: '',
    roles: null,
  
    actions: {        
        save: function() {
          let api = this.gameApi;
          api.requestOne('jobCategoryCreate', { id: this.get('id'),
             name: this.get('name'), 
             color: this.get('color'),
             template: this.get('template'),
             roles: (this.get('roles') || [])}, null)
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