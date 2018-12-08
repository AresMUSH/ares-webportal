import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(DefaultRoute, ReloadableRoute, {
    gameApi: service(),
    gameSocket: service(),
    session: service(),
    
    model: function(params) {
        let api = this.get('gameApi');
        return api.requestOne('job', {id: params['id'] }).
        then((model) => {
          this.get('gameSocket').updateJobsBadge(model.unread_jobs_count);
          return model;
          }
        );
    }    
});
