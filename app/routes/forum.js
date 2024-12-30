import $ from "jquery"
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    gameSocket: service(),
    session: service(),
    
    activate: function() {
        this.controllerFor('forum').setupCallback();
        $(window).on('beforeunload', () => {
            this.deactivate();
        });
    },

    deactivate: function() {
        this.gameSocket.removeCallback('new_forum_activity');
    },
  
    model: function() {
        let api = this.gameApi;
        return api.requestOne('forumList');
    },    
});
