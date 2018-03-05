import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    subject: '',
    message: '',
    to_list: '',
    
    resetOnExit: function() {
        this.set('subject', '');
        this.set('message', '');
        this.set('to_list', '');
    },
    
    actions: {
        sendMail: function() {
            let api = this.get('gameApi');
            api.requestOne('sendMail', { subject: this.get('subject'), 
               message: this.get('message'),
               to_list: this.get('to_list')}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('mail');
                this.get('flashMessages').success('Sent!');
            });
        }
    }
});