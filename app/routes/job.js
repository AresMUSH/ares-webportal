import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RSVP from 'rsvp';

export default Route.extend(DefaultRoute, ReloadableRoute, {
    gameApi: service(),
    gameSocket: service(),
    
    model: function(params) {
        let api = this.gameApi;

        return RSVP.hash({
             job:  api.requestOne('job', { id: params['id']  }),
             options: api.requestOne('jobOptions'),
             characters: api.requestMany('characters', { select: 'all' })
           })
           .then((model) => {
             this.gameSocket.updateJobsBadge(model.job.unread_jobs_count);
             return EmberObject.create(model);
           });
           
    }    
});
