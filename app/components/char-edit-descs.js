import Component from '@ember/component';
import { action } from '@ember/object';
import { notifyPropertyChange } from '@ember/object';

export default Component.extend({
  tagName: '',

  @action
  addOutfit() {
    let count = this.get('model.char.descs.outfits.length');
    this.get('model.char.descs.outfits').push({ name: '', desc: '', key: count + 1 });
    notifyPropertyChange(this, 'model');
  },
    
  @action
  removeOutfit(key) {
    let outfits = this.get('model.char.descs.outfits');
    outfits = outfits.filter(p => p.key != key);
    this.set('model.char.descs.outfits', outfits);
  },
  
  @action
  addDetail() {
    let count = this.get('model.char.descs.details.length');
    this.get('model.char.descs.details').push({ name: '', desc: '', key: count + 1 });
    notifyPropertyChange(this, 'model');    
  },
    
  @action
  removeDetail(key) {
    let details = this.get('model.char.descs.details');
    details = details.filter(p => p.key != key);
    this.set('model.char.descs.details', details);
  }
});
