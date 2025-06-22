import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { action } from '@ember/object';

export default Controller.extend(AuthenticatedController, {    
  gameApi: service(),
  flashMessages: service(),
            
  @action
  save() {
    let api = this.gameApi;
    let motd = this.get('model.motd');

    api.requestOne('saveMotd', { motd: this.get('model.motd') }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
        
      this.flashMessages.success('MOTD saved.');
      this.send('reloadModel');
    });  
  }
});