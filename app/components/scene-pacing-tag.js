import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'span',
    
  pacing: computed('scene.scene_pacing', function() {
    let name = this.get('scene.scene_pacing') || "";
    if (name === "Asynchronous") {
      return "Async";
    } else if (name === "Traditional") {
      return "Trad";
    } else if (name === "Distracted") {
      return "Distract";
    }
    return name.substring(0,5);
  }),
  
  labelStyle: computed('scene.scene_pacing', function() {
    return this.get('scene.scene_pacing').toLowerCase();
  })
});
