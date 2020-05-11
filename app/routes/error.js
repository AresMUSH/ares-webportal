import Route from '@ember/routing/route';

export default Route.extend({
  activate: function() {
      this.controllerFor('application').set('hideSidebar', true);
  },
  deactivate: function() {
      this.controllerFor('application').set('hideSidebar', false);
      this.controllerFor('client').send('disconnect');
  }
});
