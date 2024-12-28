import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { notifyPropertyChange } from '@ember/object';

export default Controller.extend({
  flashMessages: service(),
  gameApi: service(),
  router: service(),
  
  name: '',
  summary: '',
  description: '',
  area: null,
  owners: null,
  details: [],
  icon_type: '',

  resetOnExit: function() {
    this.set('name', '');
    this.set('description', '');
    this.set('summary', '');
    this.set('area', null);
    this.set('owners', null);
    this.set('details', []);
    this.set('icon_type', '');
  },  
    
  @action
  addDetail() {
    let count = this.get('details.length');
    this.get('details').push({ name: '', desc: '', key: count + 1 });
    notifyPropertyChange(this, 'details');
  },
    
  @action
  removeDetail(key) {
    let details = this.get('this.details');
    details = details.filter(p => p.key != key);
    this.set('details', details);
  },
      
  @action
  ownersChanged(newOwners) {
    this.set('owners', newOwners);
  },
    
  @action
  areaChanged(newArea) {
    this.set('area', newArea);
  },
    
  @action
  iconChanged(newIcon) {
    this.set('icon_type', newIcon);
  },
      
  @action  
  save() {
    let api = this.gameApi;
      
    let descs = {}
    descs['current'] = this.get('description');
    descs['details'] = {};
    this.get('details').forEach(function(p) {
      descs['details'][p.name] = p.desc;
    });
      
    api.requestOne('createLocation', 
    { 
      name: this.get('name'), 
      area_id: this.get('area.id'), 
      owners: (this.get('owners') || []).map(owner => owner.name),
      summary: this.get('summary'),
      icon_type: this.get('icon_type'),
      descs: descs
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('location', response.id);
      this.flashMessages.success('Location created!');
    });
  }
});