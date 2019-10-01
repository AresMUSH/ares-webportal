import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  topLevelAreas: function() {
    return this.get('model.directory').filter(a => a.is_top_level);
  }.property('model')
    
});