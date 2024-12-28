import Component from '@ember/component';
import { action } from '@ember/object';
import { notifyPropertyChange } from '@ember/object';

export default Component.extend({
  tagName: '',

  @action
  addProfile() {
    let count = this.get('model.char.profile.length');
    this.get('model.char.profile').push({ name: '', text: '', key: count + 1 });
    notifyPropertyChange(this, 'model');
  },
    
  @action
  removeProfile(key) {
    let profile = this.get('model.char.profile');
    profile = profile.filter(p => p.key != key);
    this.set('model.char.profile', profile);
  }
});
