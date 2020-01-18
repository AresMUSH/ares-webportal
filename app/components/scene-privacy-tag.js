import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'span',

  privacy: computed('scene.{is_private,limit}', function() {
    if (this.get('scene.is_private')) {
      return 'Private';
    }
    else if (this.get('scene.limit')) {
      return 'Limited';
    }
    else {
      return 'Open';
    }
  }),
    
  labelStyle: computed('privacy', function() {
    return this.get('privacy').toLowerCase();
  })
});
