import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  gameApi: service(),
  router: service(),
  
  @action       
  save() {
    let api = this.gameApi;
    api.requestOne('saveForum', 
    {
      id: this.get('model.category.id'),
      name: this.get('model.category.name'), 
      desc: this.get('model.category.desc'),
      order: this.get('model.category.order'),
      can_read: (this.get('model.category.can_read') || []),
      can_write: (this.get('model.category.can_write') || [])
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('forum-manage');
      this.flashMessages.success('Category updated!');
    });
  },
        
  @action
  readRolesChanged(roles) {
    this.set('model.category.can_read', roles);
  },


  @action
  writeRolesChanged(roles) {
    this.set('model.category.can_write', roles);
  }
    
});