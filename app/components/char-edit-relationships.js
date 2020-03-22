import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {
    addRelationship() {
        let count = this.get('model.char.relationships.length');
        this.get('model.char.relationships').pushObject({ name: '', text: '', key: count + 1 });
    },

    removeRelationship(key) {
        let relationships = this.get('model.char.relationships');
        relationships = relationships.filter(p => p.key != key);
        this.set('model.char.relationships', relationships);
    }
  }
});
