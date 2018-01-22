import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    ajax: service(),
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
            let aj = this.get('ajax');
            aj.queryOne('sendMail', { subject: this.get('subject'), 
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