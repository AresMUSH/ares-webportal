import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'ares-webclient/mixins/authenticated-route';
import ReloadableRoute from 'ares-webclient/mixins/reloadable-route';

export default Route.extend(AuthenticatedRoute, ReloadableRoute, {
    ajax: service(),
    titleToken: 'Chat',
    
    activate: function() {
        this.controllerFor('chat').setupCallback();
    },
    
    model: function() {
        let aj = this.get('ajax');
        return aj.request('chat');
    },
    
    chatCallback: function(self, channelName) {
        let channels = self.get('channels');
        let channel = channels[channelName];
        let messages = channel.new_messages || 0;
        channel.new_messages =  messages + 1;
        //this.send('reloadModel');
    }
});
