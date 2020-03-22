import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  flashMessages: service(),
  gameApi: service(),
    
  actions: {
    addDetail() {
      let count = this.get('model.location.descs.details.length');
      this.get('model.location.descs.details').pushObject({ name: '', desc: '', key: count + 1 });
    },
    
    removeDetail(key) {
      let details = this.get('model.location.descs.details');
      details = details.filter(p => p.key != key);
      this.set('model.location.descs.details', details);
    },
      
    ownersChanged(newOwners) {
      this.set('model.location.owners', newOwners);
    },
    areaChanged(newArea) {
      this.set('model.location.area', newArea);
    },
        
    save: function() {
      let api = this.gameApi;
      
      let descs = {}
      descs['current'] = this.get('model.location.descs.current');
      descs['details'] = {};
      this.get('model.location.descs.details').forEach(function(p) {
          descs['details'][p.name] = p.desc;
      });
      
      api.requestOne('editLocation', { id: this.get('model.location.id'),
      name: this.get('model.location.name'), 
      area: this.get('model.location.area.id'), 
      owners: (this.get('model.location.owners') || []).map(owner => owner.name),
      descs: descs}, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.transitionToRoute('location',                          
        this.get('model.location.id'));
        this.flashMessages.success('Location updated!');
      });
    }
  }
});