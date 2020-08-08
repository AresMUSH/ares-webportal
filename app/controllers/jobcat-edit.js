import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
  
    actions: {        
        save: function() {
          let api = this.gameApi;
          api.requestOne('jobCategorySave', { id: this.get('model.category.id'),
             name: this.get('model.category.name'), 
             color: this.get('model.category.color'),
             template: this.get('model.category.template'),
             roles: (this.get('model.category.roles') || [])}, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.transitionToRoute('jobcat-manage');
              this.flashMessages.success('Category updated!');
          });
        },
        
        rolesChanged: function(roles) {
          this.set('model.category.roles', roles);
        }
    }
    
});