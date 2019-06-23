import Component from '@ember/component';
import { timeDiff } from 'ares-webportal/helpers/time-diff';

export default Component.extend({
  time: null,
  tagName: 'span',
  timerId: null,
  
  watchOrder: Ember.observer('poseOrder.@each.time', function(){
    this.updateTime();
  }),
  
  updateTime: function() {
    this.get('poseOrder').forEach(po => {
      Ember.set(po, 'timeString', timeDiff({}, { time: po.time }));
    });
  },
  
  didInsertElement: function() {
    this.updateTime();
    let timer = window.setInterval(this.updateTime.bind(this), 1000*60);
    this.set('timerId', timer);
  },
  
  willDestroyElement: function() {
    window.clearInterval(this.get('timerId'));
    this.set('timerId', null);
  }
});
