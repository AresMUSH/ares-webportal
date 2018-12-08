import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
    tag: "Inbox",
    
    messages: function() {
        let allMail = this.get('model.mail');
        if (this.get('tag') === 'Trash') {
          return allMail.filter(m => m.is_in_trash);
        }
        else {
          return allMail.filter(m => !m.is_in_trash && m.tags.includes(this.get('tag')));
        }
    }.property('tag', 'model.mail.@each.subject'),
    
    sentMail: function() {
        return this.get('tag') === 'Sent';
    }.property('tag'),
    
    actions: {
        changeTag(tag) {
            this.set('tag', tag);
        }
    }
});