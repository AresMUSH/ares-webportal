import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';

export default Route.extend(ReloadableRoute, RouteResetOnExit, {
    ajax: service(),

    titleToken: function(model) {
        return `Scene ${model.id}`;  
    },
    
    activate: function() {
        this.controllerFor('scene-live').setupCallback();
    },

    model: function(params) {
        let aj = this.get('ajax');
        return aj.requestOne('liveScene', { id: params['id'] });
           
    }
});
