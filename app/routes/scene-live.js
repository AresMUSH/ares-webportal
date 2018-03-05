import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';

export default Route.extend(ReloadableRoute, RouteResetOnExit, {
    gameApi: service(),
    gameSocket: service(),

    titleToken: function(model) {
        return `Scene ${model.id}`;  
    },

    activate: function() {
        this.controllerFor('scene-live').setupCallback();
    },

    deactivate: function() {
        this.get('gameSocket').set('sceneCallback', null);
        let api = this.get('gameApi');
        let model = this.modelFor('scene-live');
        if (model) {            
            api.requestOne('watchScene', { id: model.id, watch: false  });
        }
    },

    model: function(params) {
        let api = this.get('gameApi');
        return api.requestOne('liveScene', { id: params['id'] })
        .then( response => {
            api.requestOne('watchScene', { id: params['id'], watch: true });
            return response;
           }
        )
           
    }
});
