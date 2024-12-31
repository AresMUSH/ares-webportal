import $ from "jquery"
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import { TrackedArray } from 'tracked-built-ins';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    gameSocket: service(),
  
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
    
    afterModel: function(model) {
      model.set('posts', new TrackedArray((model.posts || []).slice()));
    }
});
