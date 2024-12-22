import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  tagName: '',

  @action
  addRelationship() {
    let count = this.get('model.char.relationships.length');
    this.get('model.char.relationships').pushObject({ name: '', text: '', key: count + 1 });
  },

  @action
  removeRelationship(key) {
    let relationships = this.get('model.char.relationships');
    relationships = relationships.filter(p => p.key != key);
    this.set('model.char.relationships', relationships);
  }
});
