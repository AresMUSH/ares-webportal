import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import RSVP from 'rsvp';

export default Route.extend(DefaultRoute, ReloadableRoute, {
    gameApi: service(),
    session: service(),
  
    afterModel: function(model) {
      var statusFilter = [];
      model.get('options.status_values').forEach(function(s) {
        let hash = { name: s, selected: true };
        statusFilter.pushObject(hash);
      });
    
      model.set('status_filter', statusFilter);

      var categoryFilter = [];
      model.get('options.category_values').forEach(function(s) {
        let hash = { name: s, selected: true };
        categoryFilter.pushObject(hash);
      });
      model.set('category_filter', categoryFilter);
    },
    
    model: function() {
      let api = this.get('gameApi');
      return RSVP.hash({
           jobs:  api.requestMany('jobs'),
           options: api.requestOne('jobOptions')
         })
         .then((model) => {
           return Ember.Object.create(model);
         });
    }  
});
