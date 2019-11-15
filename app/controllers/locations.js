import Controller from '@ember/controller';

export default Controller.extend({
  topLevelAreas: function() {
    return this.get('model.directory').filter(a => a.is_top_level);
  }.property('model')
    
});