import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webportal/mixins/reloadable-route';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, ReloadableRoute, {
    gameApi: service(),
    headData: service(),
    
    afterModel: function(model) { 
        if (model.get('char.playerbit')) {
            this.transitionTo('player', model.get('char.name'));
        }
        this.set('headData.robotindex', true);
    },
    
    model: function(params) {
        let api = this.gameApi;
        return RSVP.hash({
            char: api.requestOne('character', { id: params['id'] }),
            game: this.modelFor('application').game,
            scenes: api.requestOne('scenes', { char_id: params['id'], filter: 'All', page: 1 }),
            sceneOptions: api.requestOne('sceneOptions') })
            .then((model) => EmberObject.create(model));
    }
});
