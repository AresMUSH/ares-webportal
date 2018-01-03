import Component from '@ember/component';

export default Component.extend({
  tagName: 'span',
    
    style: function() {
        return this.get('scene.scene_type').toLowerCase();
    }.property('scene.scene_type')
});
