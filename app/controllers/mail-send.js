import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    subject: '',
    message: '',
    toList: [],
    
    resetOnExit: function() {
        this.set('subject', '');
        this.set('message', '');
        this.set('toList', []);
    },
    
    actions: {
        sendMail: function() {
            let api = this.get('gameApi');
            api.requestOne('sendMail', { subject: this.get('subject'), 
               message: this.get('message'),
               to_list: (this.get('toList') || []).map(p => p.name) }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('mail');
                this.get('flashMessages').success('Sent!');
            });
        },
        toListChanged(newList) {
            this.set('toList', newList);
        },
    }
});