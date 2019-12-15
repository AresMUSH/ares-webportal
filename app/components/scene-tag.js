import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'span',
    
    style: computed('scene.scene_type', function() {
        return this.get('scene.scene_type').toLowerCase();
    })
});
