import Route from '@ember/routing/route';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
  model: function() {
      return this.modelFor('application');
  }
});
