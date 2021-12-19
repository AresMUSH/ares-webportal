import { observer, set } from '@ember/object';
import Component from '@ember/component';
import { timeDiff } from 'ares-webportal/helpers/time-diff';

export default Component.extend({
  time: null,
  tagName: 'span',
  timerId: null,
  
  watchOrder: observer('poseOrder.@each.time', function(){
    this.updateTime();
  }),
  
  updateTime: function() {
    if (!this.poseOrder) {
      return;
    }
    this.poseOrder.forEach(po => {
      set(po, 'timeString', timeDiff({}, { time: po.time }));
    });
  },
  
  didInsertElement: function() {
    this._super(...arguments);
    this.updateTime();
    let timer = window.setInterval(this.updateTime.bind(this), 1000*60*5); // Update each five mins
    this.set('timerId', timer);
  },
  
  willDestroyElement: function() {
    this._super(...arguments);
    window.clearInterval(this.timerId);
    this.set('timerId', null);
  }
});
