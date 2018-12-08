import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';

export default Route.extend(AuthenticatedRoute, RouteResetOnExit, {
    gameApi: service(),
    gameSocket: service(),
        
    model: function(params) {
        let api = this.get('gameApi');
        return api.requestOne('mailMessage', { id: params['id']}).
        then((model) => {
          this.get('gameSocket').updateMailBadge(model.unread_mail_count);
          return model;
          }
        );
    }
});
