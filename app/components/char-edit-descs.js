import Component from '@ember/component';
import { action } from '@ember/object';
import { pushObject } from 'ares-webportal/helpers/object-ext';

export default Component.extend({
  tagName: '',

  @action
  addOutfit() {
    let count = this.get('model.char.descs.outfits.length');
    pushObject(this.get('model.char.descs.outfits'), { name: '', desc: '', key: count + 1 }, this, 'model');
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
    pushObject(this.get('model.char.descs.details'), { name: '', desc: '', key: count + 1 }, this, 'model');  },
    
  @action
  removeDetail(key) {
    let details = this.get('model.char.descs.details');
    details = details.filter(p => p.key != key);
    this.set('model.char.descs.details', details);
  }
});
