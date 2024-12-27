import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  flashMessages: service(),
  gameApi: service(),
  router: service(),
    
  @action
  addDetail() {
    let count = this.get('model.location.descs.details.length');
    this.get('model.location.descs.details').pushObject({ name: '', desc: '', key: count + 1 });
  },
    
  @action
  removeDetail(key) {
    let details = this.get('model.location.descs.details');
    details = details.filter(p => p.key != key);
    this.set('model.location.descs.details', details);
  },
     
  @action 
  ownersChanged(newOwners) {
    this.set('model.location.owners', newOwners);
  },
    
  @action
  areaChanged(newArea) {
    this.set('model.location.area', newArea);
  },
    
  @action
  iconChanged(newIcon) {
    this.set('model.location.icon_type', newIcon);
  },
        
        
  @action
  save() {
    let api = this.gameApi;
      
    let descs = {}
    descs['current'] = this.get('model.location.descs.current');
    descs['details'] = {};
    this.get('model.location.descs.details').forEach(function(p) {
      descs['details'][p.name] = p.desc;
    });
      
    api.requestOne('editLocation', 
    {
      id: this.get('model.location.id'),
      name: this.get('model.location.name'), 
      area_id: this.get('model.location.area.id'), 
      owners: (this.get('model.location.owners') || []).map(owner => owner.name),
      summary: this.get('model.location.summary'),
      icon_type: this.get('model.location.icon_type'),
      descs: descs
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('location',                          
      this.get('model.location.id'));
      this.flashMessages.success('Location updated!');
    });
  }
});