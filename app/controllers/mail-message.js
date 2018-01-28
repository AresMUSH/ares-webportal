import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    ajax: service(),
    flashMessages: service(),
    subject: '',
    message: '',
    to_list: '',

    setup: function() {
        this.set('subject', `Re: ${this.get('model.subject')}`);
        this.set('to_list', this.get('model.from'));
        this.set('message', '');
    }.observes('model'),
    
    actions: {
        sendReply: function() {
            let aj = this.get('ajax');
            aj.requestOne('sendMail', { subject: this.get('subject'), 
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