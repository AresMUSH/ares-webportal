import Component from '@ember/component';

export default Component.extend({
  maxValue: 0,
  currentValue: 0,
  tagName: '',
  
  progress: function() {
    if (this.get('maxValue') === 0) {
      return 0;
    }
    return 100.0 * this.get('currentValue') / this.get('maxValue');
  }.property('currentValue'),
  
  widthStyle: function() {
    return Ember.String.htmlSafe(`width: ${this.get('progress')}%;`);
  }.property('progress')
});
