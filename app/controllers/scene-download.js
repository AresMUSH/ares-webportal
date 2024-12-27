import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  showOoc: false,
  showSystem: true,
  gameApi: service(),
    
  reloadScene: function() {
    let showOoc = this.showOoc;
    let showSystem = this.showSystem;
    let api = this.gameApi;
    return api.requestOne('downloadScene', { id: this.get('model.id'), 
    show_ooc: showOoc, show_system: showSystem })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.set('model', response);
    });
  },
  resetOnExit: function() {
    this.set('showOoc', false);
    this.set('showSystem', true);
  },

  @action
  toggleOoc() {
    this.set('showOoc', !this.showOoc);
    this.reloadScene();
  },
  
  @action
  toggleSystem() {
    this.set('showSystem', !this.showSystem);
    this.reloadScene();
  },
  
  @action
  download() {
          
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.get('model.log')));
    element.setAttribute('download', this.get('model.title'));

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
});