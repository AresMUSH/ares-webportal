import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),
    router: service(),
    
    actions: {
      changeParent: function(area) {
        this.set('model.area.parent', area);
      },
      
      edit: function() {
          let api = this.gameApi;
          api.requestOne('editArea', { id: this.get('model.area.id'),
             name: this.get('model.area.name'), 
             description: this.get('model.area.description'),
             summary: this.get('model.area.summary'),
             parent_id: this.get('model.area.parent.id') }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.router.transitionTo('area', this.get('model.area.id'));
              this.flashMessages.success('Area updated!');
          });
      }
    }
});