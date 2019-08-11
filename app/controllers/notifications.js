import { set } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),

    actions: {
        markAllRead() {
            let api = this.gameApi;
            api.requestOne('markNotificationsRead')
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.send('reloadModel');
            });
        }
    }
});