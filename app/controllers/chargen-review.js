import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    appNotes: '',

    resetOnExit: function() {
        this.set('appNotes', '');
    },

    actions: {
        submit() {
            let api = this.get('gameApi');
            api.requestOne('chargenSubmit', { app_notes: this.get('appNotes') })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.get('flashMessages').success('You have submitted your application.  Check for responses to your app in Requests.');
                this.transitionToRoute('chargen');
            });
        }
    }
});
