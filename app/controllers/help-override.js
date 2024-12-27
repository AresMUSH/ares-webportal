import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  flashMessages: service(),
  gameApi: service(),
  session: service(),
  router: service(),
    
  @action
  save() {
    let api = this.gameApi;
    api.requestOne('overrideHelp', 
    { 
      topic: this.get('model.key'), 
      contents: this.get('model.raw_contents')
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('help-topic',                          
      response.topic);
      this.flashMessages.success('Custom help file created!');
    });
  }
});