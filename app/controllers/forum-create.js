import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    name: '',
    desc: '',
    order: '',
    can_read: null,
    can_write: null,
  
    actions: {        
        save: function() {
          let api = this.gameApi;
          api.requestOne('createForum', { id: this.get('id'),
             name: this.get('name'), 
             desc: this.get('desc'),
             order: this.get('order'),
             can_read: (this.get('can_read') || []),
             can_write: (this.get('can_write') || [])}, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.transitionToRoute('forum-manage');
              this.flashMessages.success('Forum category created!');
          });
        },
        
        readRolesChanged: function(roles) {
          this.set('can_read', roles);
        },

        writeRolesChanged: function(roles) {
          this.set('can_write', roles);
        }
    }
    
});