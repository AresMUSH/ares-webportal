import $ from "jquery"
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    gameSocket: service(),
    headData: service(),
  
    activate: function() {
        this.controllerFor('forum-category').setupCallback();
        $(window).on('beforeunload', () => {
            this.deactivate();
        });
    },

    deactivate: function() {
        this.gameSocket.removeCallback('new_forum_activity');
    },
  
    model: function(params) {
        let api = this.gameApi;
        return api.requestOne('forumCategory', {category_id: params['category_id']});
    },
    
    afterModel: function() {
      this.set('headData.robotindex', true);
    }
});
