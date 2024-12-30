import Component from '@ember/component';
import { action } from '@ember/object';
import { pushObject } from 'ares-webportal/helpers/object-ext';

export default Component.extend({
  tagName: '',

  @action
  addRelationship() {
    let count = this.get('model.char.relationships.length');
    pushObject(this.get('model.char.relationships'), { name: '', text: '', key: count + 1 }, this, 'model');    
  },

  @action
  removeRelationship(key) {
    let relationships = this.get('model.char.relationships');
    relationships = relationships.filter(p => p.key != key);
    this.set('model.char.relationships', relationships);
  }
});
