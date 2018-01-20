import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import ReloadableRoute from 'ares-webclient/mixins/reloadable-route';

export default Route.extend(ReloadableRoute, {
    ajax: service(),
        
    model: function(params) {
        let aj = this.get('ajax');
        return RSVP.hash({
            plot: aj.queryOne('plot', { id: params['id'] }),
            sceneTypes: aj.queryMany('sceneTypes') })
            .then((model) => Ember.Object.create(model));
    },
    
    titleToken: function(model) {
        return model.title;
    }
});
