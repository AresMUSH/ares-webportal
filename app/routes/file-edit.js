import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
  gameApi: service(),
    
  model: function(params) {
      let api = this.gameApi;
      return api.requestOne('file', {folder: params['folder'],
         name: params['name']});
  },
  afterModel: function(model) {
    model.set('new_name', model.name);
    model.set('new_folder', model.folder);
    model.set('new_description', model.description);
  }
});
