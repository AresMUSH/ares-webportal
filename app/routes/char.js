import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    gameApi: service(),
    
    afterModel: function(model) { 
        if (model.get('char.playerbit')) {
            this.transitionTo('player', model.get('char.id'));
        }
    },
    
    model: function(params) {
        let api = this.get('gameApi');
        return RSVP.hash({
            char: api.requestOne('character', { id: params['id'] }),
            game: this.modelFor('application').game,
            sceneTypes: api.requestMany('sceneTypes') })
            .then((model) => Ember.Object.create(model));
    },
    
    titleToken: function(model) {
        return model.char.name;
    }
});
