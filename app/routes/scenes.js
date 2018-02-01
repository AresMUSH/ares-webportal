import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';

export default Route.extend(DefaultRoute, {
    ajax: service(),
    titleToken: 'Scenes',
    
    model: function() {
        let aj = this.get('ajax');
        return RSVP.hash({
             scenes:  aj.requestMany('scenes'),
             sceneTypes: aj.requestMany('sceneTypes'),
           })
           .then((model) => Ember.Object.create(model));
           
    }
});
