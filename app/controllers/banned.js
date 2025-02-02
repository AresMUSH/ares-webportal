import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),

  banSiteName: '',
  banPlayerObj: null,
  banReason: '',
  banPlayerReason: '',
  
  resetOnExit: function() {
    this.set('banSiteName', '');
    this.set('banReason', '');
    this.set('banPlayerObj', null);
    this.set('banPlayerReason', '');
  },
    
  @action
  banPlayerChanged(player) {
    this.set('banPlayerObj', player);
  },
      
  @action
  removeBan(site) {
          
    this.gameApi.requestOne('banRemove', 
    { site: site}, null)
    .then((response) => {            
      if (response.error) {
        return;
      }            
      this.send('reloadModel');
      this.flashMessages.success("Ban removed.");
    });
  }, 
      
  @action
  banSite() {
    if (this.banSiteName.length == 0 || this.banReason.length == 0) {
      this.flashMessages.danger("You must specify a site and reason.");
      return;
    }
    this.gameApi.requestOne('banAdd', 
    { site: this.banSiteName, reason: this.banReason }, null)
    .then((response) => {            
      if (response.error) {
        return;
      }            
      this.send('reloadModel');
      this.flashMessages.success("Ban added.");
    });
        
  },
      
  @action
  banPlayer() {
    if (!this.banPlayer || this.banPlayerReason.length == 0) {
      this.flashMessages.danger("You must specify a player and reason.");
      return;
    }
    this.gameApi.requestOne('banPlayer', 
    { name: this.get('banPlayerObj.name'), reason: this.banPlayerReason }, null)
    .then((response) => {            
      if (response.error) {
        return;
      }            
      this.send('reloadModel');
      this.flashMessages.success("Player banned.");
    });
        
  },
});