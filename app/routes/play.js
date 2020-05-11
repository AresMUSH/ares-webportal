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
        this.controllerFor('play').setupCallback();
        this.controllerFor('application').set('hideSidebar', true);
        $(window).on('beforeunload', () => {
            this.deactivate();
        });
    },

    deactivate: function() {
        this.gameSocket.removeCallback('new_scene_activity');
        this.gameSocket.removeCallback('new_chat');
        this.gameSocket.removeCallback('new_page');
        this.controllerFor('application').set('hideSidebar', false);
    },

    model: function(params) {
        let api = this.gameApi;
        return RSVP.hash({
             scenes: api.requestMany('myScenes'),
             abilities:  api.request('charAbilities', { id: this.get('session.data.authenticated.id') }),
             locations: api.request('sceneLocations', { id: params['id'] }),
             chat: api.requestMany('chat'),
             characters: api.requestMany('characters', { select: 'all' })
           })
           .then((model) => EmberObject.create(model));
    },
    
    setupController: function(controller, model) {
      this._super(controller, model);
      if (model.scenes.length > 0) {
        controller.set('currentScene', model.scenes[0]);
        controller.set('currentScene.is_unread', false);        
      } else {
        let chan = controller.sortedChannels.find(c => c.enabled);
        if (chan) {
          controller.set('selectedChannel', chan);
        }
      }
    }
});
