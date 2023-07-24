import Component from '@ember/component';
import { equal } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Component.extend({
  selectedTag: 'Inbox',
  selectedMessage: null,
  
  sentMail: equal('selectedTag', 'Sent'),
  
  messages: computed('selectedTag', 'inbox.unread_count', function() {
        let allMail = this.get('inbox.mail');
        if (this.selectedTag === 'Trash') {
          return allMail.filter(m => m.is_in_trash);
        }
        else {
          return allMail.filter(m => !m.is_in_trash && m.tags.includes(this.selectedTag));
        }
    }),
  
  actions: {
      changeTag(tag) {
          this.set('selectedTag', tag);
      }
  }
});
