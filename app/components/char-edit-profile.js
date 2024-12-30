import Component from '@ember/component';
import { action } from '@ember/object';
import { pushObject } from 'ares-webportal/helpers/object-ext';

export default Component.extend({
  tagName: '',

  @action
  addProfile() {
    let count = this.get('model.char.profile.length');
    pushObject(this.get('model.char.profile'), { name: '', text: '', key: count + 1 }, this, 'model');
  },
    
  @action
  removeProfile(key) {
    let profile = this.get('model.char.profile');
    profile = profile.filter(p => p.key != key);
    this.set('model.char.profile', profile);
  }
});
