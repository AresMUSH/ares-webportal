import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  flashMessages: service(),
  gameApi: service(),
  router: service(),
    
  @action
  storytellersChanged(new_storytellers) {
    this.set('model.plot.storytellers', new_storytellers);
  },
        
  @action
  save() {
    let api = this.gameApi;
            
    let tags = this.get('model.plot.tags') || [];
    if (!Array.isArray(tags)) {
      tags = tags.split(/[\s,]/);
    }
            
    api.requestOne('editPlot', 
    {
      id: this.get('model.plot.id'),
      title: this.get('model.plot.title'), 
      summary: this.get('model.plot.summary'),
      storytellers: (this.get('model.plot.storytellers') || []).map(storyteller => storyteller.name),
      completed: this.get('model.plot.completed'),
      content_warning: this.get('model.plot.content_warning'),
      description: this.get('model.plot.description'),
      tags: tags
            
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.router.transitionTo('plot',                          
      this.get('model.plot.id'));
      this.flashMessages.success('Plot updated!');
    });
  }
});