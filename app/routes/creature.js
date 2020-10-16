import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, ReloadableRoute, {
    gameApi: service(),

    afterModel: function(model) {
        if (model.get('char.playerbit')) {
            this.transitionTo('player', model.get('char.id'));
        }
    },

    model: function(params) {
        let api = this.get('gameApi');
        return RSVP.hash({
            creature: api.requestOne('creature', { id: params['id'] })
            .then((model) => Ember.Object.create(model));
    }
});
