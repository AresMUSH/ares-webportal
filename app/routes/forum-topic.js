import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultRoute from 'ares-webportal/mixins/default-route';
import { action } from '@ember/object';

export default Route.extend(DefaultRoute, {
  gameApi: service(),
  gameSocket: service(),
  session: service(),
    
  activate: function() {
    this.controllerFor('forum-topic').setupCallback();
  },

  @action 
  willTransition(transition) {
    this.gameSocket.removeCallback('new_forum_activity');
  },
  
  model: function(params) {
    let api = this.gameApi;
    return api.requestOne('forumTopic', { topic_id: params['topic_id'] });
  },
    
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.setup();
  }
});
