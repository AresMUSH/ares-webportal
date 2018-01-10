import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import RouteTransitionOnError from 'ares-webclient/mixins/route-transition-on-error';

export default Route.extend(RouteTransitionOnError, {
    ajax: service(),
    errorRoute: 'characters',
    
    afterModel: function(model) { 
        if (model && model.error) {
            this.transitionTo(this.get('errorRoute'));
        }
        else if (model.get('char.playerbit')) {
            this.transitionTo('player', model.get('char.id'));
        }
    },
    
    model: function(params) {
        let aj = this.get('ajax');
        return RSVP.hash({
            char: aj.queryOne('character', { id: params['id'] }),
            game: this.modelFor('application').game })
            .then((model) => Ember.Object.create(model));
    },
    
    titleToken: function(model) {
        return model.name;
    }
});
