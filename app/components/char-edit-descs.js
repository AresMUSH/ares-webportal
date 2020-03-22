import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {

    addOutfit() {
        let count = this.get('model.char.descs.outfits.length');
        this.get('model.char.descs.outfits').pushObject({ name: '', desc: '', key: count + 1 });
    },
    
    removeOutfit(key) {
        let outfits = this.get('model.char.descs.outfits');
        outfits = outfits.filter(p => p.key != key);
        this.set('model.char.descs.outfits', outfits);
    },
    addDetail() {
        let count = this.get('model.char.descs.details.length');
        this.get('model.char.descs.details').pushObject({ name: '', desc: '', key: count + 1 });
    },
    
    removeDetail(key) {
        let details = this.get('model.char.descs.details');
        details = details.filter(p => p.key != key);
        this.set('model.char.descs.details', details);
    }
  }
});
