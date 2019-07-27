import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';

export default Route.extend(DefaultRoute, ReloadableRoute, RouteResetOnExit, {
    gameApi: service(),
    gameSocket: service(),
    
    activate: function() {
        this.controllerFor('scenes-live').setupCallback();
    },
    
    deactivate: function() {
      this.get('gameSocket').removeCallback('new_scene_activity');
    },
    
    model: function() {
        let api = this.get('gameApi');
        return api.requestOne('liveScenes');
    }
});
