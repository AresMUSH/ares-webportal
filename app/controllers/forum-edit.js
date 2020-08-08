import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
  
    actions: {        
        save: function() {
          let api = this.gameApi;
          api.requestOne('saveForum', { id: this.get('model.category.id'),
             name: this.get('model.category.name'), 
             desc: this.get('model.category.desc'),
             order: this.get('model.category.order'),
             can_read: (this.get('model.category.can_read') || []),
             can_write: (this.get('model.category.can_write') || [])}, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.transitionToRoute('forum-manage');
              this.flashMessages.success('Category updated!');
          });
        },
        
        readRolesChanged: function(roles) {
          this.set('model.category.can_read', roles);
        },

        writeRolesChanged: function(roles) {
          this.set('model.category.can_write', roles);
        }
    }
    
});