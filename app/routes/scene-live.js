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

    activate: function() {
        this.controllerFor('scene-live').setupCallback();
        this.controllerFor('application').set('hideSidebar', true);
        $(window).on('beforeunload', () => {
            this.deactivate();
        });
    },

    deactivate: function() {
        this.gameSocket.removeCallback('new_scene_activity');
        this.controllerFor('application').set('hideSidebar', false);
    },

    model: function(params) {
        let api = this.gameApi;
        return RSVP.hash({
             scene: api.requestOne('liveScene', { id: params['id'] }),
             abilities:  api.request('charAbilities', { id: this.get('session.data.authenticated.id') }),
             locations: api.request('sceneLocations', { id: params['id'] })
           })
           .then((model) =>  {
             
             if (model.scene.shared) {
               this.transitionTo('scene', params['id']);             
             }
             else
             {
               return EmberObject.create(model);
             }
         });
    },
    
    setupController: function(controller, model) {
      this._super(controller, model);
      this.set('model.is_unread', false);
    }
});
