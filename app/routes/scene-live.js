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

    deactivate: function() {
        let aj = this.get('ajax');
        aj.requestOne('watchScene', { id: this.modelFor('scene-live').get('id'), watch: false  });
    },

    model: function(params) {
        let aj = this.get('ajax');
        return aj.requestOne('liveScene', { id: params['id'] })
        .then( response => {
            aj.requestOne('watchScene', { id: params['id'], watch: true });
            return response;
           }
        )
           
    }
});
