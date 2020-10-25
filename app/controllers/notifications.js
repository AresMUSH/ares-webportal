import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),

    actions: {
        markAllRead() {
            let api = this.gameApi;
            api.requestOne('markNotificationsRead')
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.flashMessages.success('Notifications marked read.');
                this.send('reloadModel');
            });
        },
        markRead(id, unread) {
            let api = this.gameApi;
            api.requestOne('markNotificationRead', { id: id, unread: unread })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                if (unread) {
                  this.flashMessages.success('Notification marked unread.');
                } else {
                  this.flashMessages.success('Notification marked read.');
                }
                this.send('reloadModel');
            });
        }
    }
});