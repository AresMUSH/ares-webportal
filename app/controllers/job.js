import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    reply: '',
    replyAdminOnly: true,
    
    ajax: service(),
    session: service(),
    flashMessages: service(),
    
    setup: function() {
        this.set('reply', '');
        this.set('replyAdminOnly', true);
    }.observes('model'),
    

    actions: {
        addReply() {
            let aj = this.get('ajax');
            aj.queryOne('jobReply', { id: this.get('model.id'), 
               reply: this.get('reply'),
               admin_only: this.get('replyAdminOnly')}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('reply', '');
                this.set('replyAdminOnly', true);
                this.send('reloadModel', {});
              this.get('flashMessages').success('Reply added!');
            });
        },
        closeJob() {
            let aj = this.get('ajax');
            aj.queryOne('jobClose', { id: this.get('model.id')})
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('reply', '');
                this.set('replyAdminOnly', true);
                this.transitionToRoute('jobs');
              this.get('flashMessages').success('Reply added!');
            });
        }
    }
});