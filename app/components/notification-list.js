import { computed } from '@ember/object';
import Component from '@ember/component';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
      
  gameApi: service(),
  flashMessages: service(),

  actions: {
      markRead(notification, unread) {
          let api = this.gameApi;
          set(notification, 'is_unread', unread);

          api.requestOne('markNotificationRead', { id: notification.id, unread: unread })
          .then( (response) => {
              if (response.error) {
                  return;
              }
              if (unread) {
                this.flashMessages.success('Notification marked unread.');
              } else {
                this.flashMessages.success('Notification marked read.');
              }
          });
      }
  }

});
