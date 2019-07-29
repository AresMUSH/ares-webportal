import { htmlSafe } from '@ember/template';
import Component from '@ember/component';

export default Component.extend({
  maxValue: 0,
  currentValue: 0,
  tagName: '',
  
  progress: function() {
    if (this.maxValue === 0) {
      return 0;
    }
    return 100.0 * this.currentValue / this.maxValue;
  }.property('currentValue'),
  
  widthStyle: function() {
    return htmlSafe(`width: ${this.progress}%;`);
  }.property('progress')
});
