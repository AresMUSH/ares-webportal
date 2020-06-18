import $ from "jquery"
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(ReloadableRoute, RouteResetOnExit, DefaultRoute, {
    gameApi: service(),
    gameSocket: service(),
    session: service(),
    headData: service(),
    
    activate: function() {
        this.controllerFor('forum-topic').setupCallback();
        $(window).on('beforeunload', () => {
            this.deactivate();
        });
    },

    deactivate: function() {
        this.gameSocket.removeCallback('new_forum_activity');
    },
  
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('forumTopic', { topic_id: params['topic_id'] });
    },
    
    afterModel: function() {
      this.set('headData.robotindex', true);
    },
    
    setupController: function(controller, model) {
      this._super(controller, model);
      controller.setup();
    }
});
