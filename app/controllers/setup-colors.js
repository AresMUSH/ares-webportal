import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { action } from '@ember/object';

export default Controller.extend(AuthenticatedController, {
  gameApi: service(),
  flashMessages: service(),
  gameSocket: service(),
  router: service(),
    
  @action
  saveColors() {
    let api = this.gameApi;
    let colors = {};
    let self = this;
    let colorsValid = true;
            
    this.model.forEach(function(c) {
      let value = c.value;
      let colorName = c.name;
      let style = new Option().style;
      style.color = value;
              
      if (style.color === '') {
        self.flashMessages.danger(`Invalid color for ${colorName}: ${value}`);
        colorsValid = false;
        return;
      }
      colors[colorName] = value;
    });
    if (!colorsValid) {
      return;
    }
    api.requestOne('saveColors', { colors: colors })
    .then( (response) => {
      if (response.error) {
        return;
      }
                
      this.flashMessages.success('Colors saved.  You will need to refresh the page for the new colors to take effect.');
      if (this.isThemeMgr) {
        this.router.transitionTo('home');
      } else {
        this.router.transitionTo('setup');  
      }
                
                
    });
  }
});