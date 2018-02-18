import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({    
    ajax: service(),
    flashMessages: service(),
    appNotes: '',
    
    resetOnExit: function() {
        this.set('appNotes', '');
    },
    
    actions: {
        submit() {
            let aj = this.get('ajax');
            aj.requestOne('chargenSubmit', { app_notes: this.get('appNotes') })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.get('flashMessages').success('You have submitted your application.  Check for responses to your app in-game.');
                this.transitionToRoute('chargen');
            });   
        }
    }
});