import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  showOoc: false,
  showSystem: true,
  gameApi: service(),
    
  reloadScene: function() {
    let showOoc = this.get('showOoc');
    let showSystem = this.get('showSystem');
    let api = this.get('gameApi');
    return api.requestOne('downloadScene', { id: this.get('model.id'), 
            show_ooc: showOoc, show_system: showSystem })
      .then( (response) => {
        if (response.error) {
          return;
        }
        this.set('model', response);
      });
  },
  actions: {
    toggleOoc() {
      this.set('showOoc', !this.get('showOoc'));
      this.reloadScene();
    },
    
    toggleSystem() {
      this.set('showSystem', !this.get('showSystem'));
      this.reloadScene();
    },
      
    download() {
          
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.get('model.log')));
      element.setAttribute('download', this.get('model.title'));

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
           
           
    }
  }
});