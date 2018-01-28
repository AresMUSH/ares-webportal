import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webclient/mixins/default-route';

export default Route.extend(DefaultRoute, {
    ajax: service(),
    
    afterModel: function(model) { 
        if (model.get('char.playerbit')) {
            this.transitionTo('player', model.get('char.id'));
        }
    },
    
    model: function(params) {
        let aj = this.get('ajax');
        return RSVP.hash({
            char: aj.requestOne('character', { id: params['id'] }),
            game: this.modelFor('application').game,
            sceneTypes: aj.requestMany('sceneTypes') })
            .then((model) => Ember.Object.create(model));
    },
    
    titleToken: function(model) {
        return model.name;
    }
});
