import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'span',
  
  ansiText: computed('text', function() {
    return ansi_up.ansi_to_html(this.text, { use_classes: true });
  })
});