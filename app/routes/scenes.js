import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
    ajax: service(),
    
    model: function() {
        let aj = this.get('ajax');
        return RSVP.hash({
             scenes:  aj.queryMany('scenes', {}),
             scene_types: aj.queryMany('sceneTypes', {}),
           });
           
    }
});
