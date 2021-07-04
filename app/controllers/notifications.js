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
        }
    }
});