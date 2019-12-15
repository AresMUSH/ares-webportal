import Controller from '@ember/controller';
import { computed } from '@ember/object';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
    tag: "Inbox",
    
    messages: computed('tag', 'model.mail.@each.subject', function() {
        let allMail = this.get('model.mail');
        if (this.tag === 'Trash') {
          return allMail.filter(m => m.is_in_trash);
        }
        else {
          return allMail.filter(m => !m.is_in_trash && m.tags.includes(this.tag));
        }
    }),
    
    sentMail: computed('tag', function() {
        return this.tag === 'Sent';
    }),
    
    actions: {
        changeTag(tag) {
            this.set('tag', tag);
        }
    }
});