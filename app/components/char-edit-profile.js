import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {

    addProfile() {
        let count = this.get('model.char.profile.length');
        this.get('model.char.profile').pushObject({ name: '', text: '', key: count + 1 });
    },
    
    removeProfile(key) {
        let profile = this.get('model.char.profile');
        profile = profile.filter(p => p.key != key);
        this.set('model.char.profile', profile);
    }
  }
});
