import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import AuthenticatedRoute from 'ares-webportal/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
  model: function() {
      this.transitionTo('chargen-char', this.get('session.data.authenticated.id'));
    }
});
