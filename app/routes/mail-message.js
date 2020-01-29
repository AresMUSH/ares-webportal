import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRoute, ReloadableRoute, RouteResetOnExit, {
    gameApi: service(),
    gameSocket: service(),
        
    model: function(params) {
        let api = this.gameApi;
        
        return RSVP.hash({
             message:  api.requestOne('mailMessage', { id: params['id']  }),
             characters: api.requestMany('characters', { select: 'all' })
           })
           .then((model) => {
          this.gameSocket.updateMailBadge(model.message.unread_mail_count);
          return EmberObject.create(model);
          }
        );
    },
    
    setupController: function(controller, model) {
      this._super(controller, model);
      controller.setup();
    }
    
});
