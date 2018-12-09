import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RSVP from 'rsvp';

export default Route.extend(DefaultRoute, ReloadableRoute, {
    gameApi: service(),
    gameSocket: service(),
    
    model: function(params) {
        let api = this.get('gameApi');

        return RSVP.hash({
             job:  api.requestOne('job', { id: params['id']  }),
             options: api.requestOne('jobOptions')
           })
           .then((model) => {
             this.get('gameSocket').updateJobsBadge(model.unread_jobs_count);
             return Ember.Object.create(model);
           });
           
    }    
});
