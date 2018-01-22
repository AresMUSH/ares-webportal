import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webclient/mixins/authenticated-controller';

export default Controller.extend(AuthenticatedController, {
    tag: "Inbox",
    
    messages: function() {
        let allMail = this.get('model.mail');
        return allMail.filter(m => m.tags.includes(this.get('tag')));
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