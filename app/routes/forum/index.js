import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    ajax: service(),
    session: service(),
    titleToken: 'Forums',
    
    model: function() {
        let aj = this.get('ajax');
        return aj.queryMany('forumList', {char_id: this.get('session.data.authenticated.name')});
    }
});
