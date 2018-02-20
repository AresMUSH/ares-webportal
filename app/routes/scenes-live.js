import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';

export default Route.extend(DefaultRoute, ReloadableRoute, RouteResetOnExit, {
    ajax: service(),
    gameSocket: service(),
    titleToken: "Active Scenes",
    
    activate: function() {
        this.controllerFor('scenes-live').setupCallback();
    },
    
    deactivate: function() {
        this.set('gameSocket.sceneCallback', null);
    },
    
    model: function() {
        let aj = this.get('ajax');
        return aj.requestMany('liveScenes');
    }
});
