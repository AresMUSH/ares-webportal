import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  

  genders: computed(function() {
    let list = [];
    this.get('model.char.genders').forEach(function(g) {
      list.push({ value: g });
    });
    return list;
  }),
  
  actions: {

    genderChanged(val) {
        this.set('model.char.demographics.gender.value', val.value);
    },
    profileImageChanged(image) {
        this.set('model.char.profile_image', image);
    },
    profileIconChanged(icon) {
        this.set('model.char.profile_icon', icon);
    }
  }
});
