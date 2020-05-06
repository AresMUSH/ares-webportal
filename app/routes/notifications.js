import $ from "jquery"
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, ReloadableRoute, {
    gameApi: service(),
        
    model: function() {
        let api = this.gameApi;
        return api.requestOne('loginNotices');
    },
    afterModel: function(model) {
      var notification_badge = $('#notificationBadge');
      notification_badge.text(model.notices.filter(n => n.is_unread).length);
    }
});
