import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';

export default Route.extend(DefaultRoute, RouteResetOnExit, ReloadableRoute, {
    ajax: service(),
    titleToken: function(model) {
        return `Combat ${model.id}`;
    },
    
    model: function(params) {
        let aj = this.get('ajax');
        return aj.requestOne('combat', { id: params['id'] });
    }
});
