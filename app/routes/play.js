import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import { action } from '@ember/object';

export default Route.extend({
  gameApi: service(),
  gameSocket: service(),
  session: service(),
  flashMessages: service(),

  activate: function() {
    this.controllerFor('application').set('hideSidebar', true);
  },

  @action 
  willTransition(transition) {
    this.gameSocket.removeCallback('new_scene_activity');
    this.gameSocket.removeCallback('new_chat');
    this.gameSocket.removeCallback('new_page');
    this.gameSocket.removeCallback('joined_scene');
    this.controllerFor('application').set('hideSidebar', false);
  },

  model: function(params) {
    let api = this.gameApi;
    return RSVP.hash({
      scenes: api.requestMany('myScenes'),
      abilities:  api.request('charAbilities', { id: this.get('session.data.authenticated.id') }),
      custom: api.requestOne('customSceneData'),
      locations: api.request('sceneLocations', { id: params['id'] }),
      chat: api.requestOne('chat'),
      characters: api.requestMany('characters', { select: 'all' }),
      app: this.modelFor('application')
    })
    .then((model) => EmberObject.create(model));
  },
        
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.setup(model);
  }
});
