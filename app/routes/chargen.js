import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
  router: service(),

  model: function() {
      this.router.transitionTo('chargen-char', this.get('session.data.authenticated.id'));
    }
});
