import Component from '@ember/component';
import { computed } from '@ember/object';
import { action } from '@ember/object';

export default Component.extend({
  tagName: '',
  

  genders: computed(function() {
    let list = [];
    this.get('model.char.genders').forEach(function(g) {
      list.push({ value: g });
    });
    return list;
  }),
  
  @action
  genderChanged(val) {
    this.set('model.char.demographics.gender.value', val.value);
  },

  @action
  profileImageChanged(image) {
    this.set('model.char.profile_image', image);
  },
  @action
  profileIconChanged(icon) {
    this.set('model.char.profile_icon', icon);
  }
});
