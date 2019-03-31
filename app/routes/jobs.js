import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import RSVP from 'rsvp';

export default Route.extend(DefaultRoute, ReloadableRoute, {
    gameApi: service(),
    gameSocket: service(),
    session: service(),
  
    activate: function() {
        this.controllerFor('jobs').setupCallback();
    },
  
    deactivate: function() {
        this.set('gameSocket.jobsCallback', null);
    },
    
    afterModel: function(model) {
      var statusFilter = [];
      model.get('options.status_values').forEach(function(s) {
        let hash = { name: s, selected: true, disabled: false };
        if (s === 'DONE' && model.get('options.jobs_filter') != 'ALL') {
          hash['disabled'] = true;
          hash['selected'] = false;
        }
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
