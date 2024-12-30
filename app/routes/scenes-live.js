import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    gameSocket: service(),
    
    activate: function() {
        this.controllerFor('scenes-live').setupCallback();
    },
    
    deactivate: function() {
      this.gameSocket.removeCallback('new_scene_activity');
    },
    
    model: function() {
        let api = this.gameApi;
        return api.requestOne('liveScenes');
    }
});
