import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  maxValue: 0,
  currentValue: 0,
  tagName: '',
  
  progress: computed('currentValue', function() {
    if (this.maxValue === 0) {
      return 0;
    }
    return 100.0 * this.currentValue / this.maxValue;
  }),
  
  widthStyle: computed('progress', function() {
    return htmlSafe(`width: ${this.progress}%;`);
  })
});
