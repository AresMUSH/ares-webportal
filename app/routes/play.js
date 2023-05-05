import $ from "jquery"
import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import RouteResetOnExit from 'ares-webportal/mixins/route-reset-on-exit';
import RSVP from 'rsvp';

export default Route.extend(ReloadableRoute, RouteResetOnExit, {
    gameApi: service(),
    gameSocket: service(),
    session: service(),
    flashMessages: service(),

    activate: function() {
      this.controllerFor('application').set('hideSidebar', true);
      $(window).on('beforeunload', () => {
          this.deactivate();
      });
    },

    deactivate: function() {
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
             spells:  api.request('charSpellList', { id: this.get('session.data.authenticated.id') })
           })
           .then((model) => EmberObject.create(model));
    },

    afterModel: function(model) {
      this.controllerFor('play').setupController(model);
    }
});
