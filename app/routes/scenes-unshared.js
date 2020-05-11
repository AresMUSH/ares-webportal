import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(ReloadableRoute, {
    gameApi: service(),
    
    model: function() {
        let api = this.gameApi;
        return api.requestOne('unsharedScenes');
    }
});
