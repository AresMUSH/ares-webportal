import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
    ajax: service(),
    titleToken: 'Scenes',
    
    model: function() {
        let aj = this.get('ajax');
        return RSVP.hash({
             scenes:  aj.queryMany('scenes', {}),
             sceneTypes: aj.queryMany('sceneTypes', {}),
           })
           .then((model) => Ember.Object.create(model));
           
    }
});
