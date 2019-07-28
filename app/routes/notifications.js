import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
    gameApi: service(),
        
    model: function() {
        let api = this.gameApi;
        return api.requestMany('loginNotices');
    },
    afterModel: function() {
      var notification_badge = $('#notificationBadge');
      notification_badge.text('0');
    }
});
