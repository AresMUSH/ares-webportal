import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  gameApi: service(),
  flashMessages: service(),
  router: service(),
  warning_tags: [],
  
  scenePacingOptions: reads('model.sceneOptions.scene_pacing'),

  sceneTypes: computed('model.sceneOptions.scene_types', function () {
    return this.get('model.sceneOptions.scene_types').map((p) => p.name);
  }),

    
  scenePrivacyValues: computed(function() { 
    return [ 'Open', 'Private' ];
  }),
    
  resetOnExit: function() {
    this.set('warning_tags', []);
  },
    
  setup: function() {
    let tags = (this.get('model.scene.content_warning') || "").split(',');
    tags.forEach(tag => {
      if (this.get('model.sceneOptions.content_warnings').includes(tag.trim())) {
        this.warning_tags.pushObject(tag);
      }
    });
  },
    
  @action
  plotsChanged(new_plots) {
    this.set('model.scene.plots', new_plots);
  },
        
  @action
  typeChanged(new_type) {
    this.set('model.scene.scene_type', new_type);
  },
        
  @action
  pacingChanged(newType) {
    this.set('model.scene.scene_pacing', newType);
  },
        
  @action
  participantsChanged(new_participants) {
    this.set('model.scene.participants', new_participants);
  },
        
  @action
  privacyChanged(newPrivacy) {
    this.set('model.scene.privacy', newPrivacy)
  },
        
  @action
  relatedChanged(new_related) {
    this.set('model.scene.related_scenes', new_related)
  },
        
  @action
  warningsChanged(new_warnings) {
    this.set('warning_tags', new_warnings);
    this.set('model.scene.content_warning', new_warnings.join(', '));
  },
        
  @action
  save() {
    let api = this.gameApi;
    let tags = this.get('model.scene.tags') || [];
    if (!Array.isArray(tags)) {
      tags = tags.split(/[\s,]/);
    }
            
    api.requestOne('editScene', 
    {
      id: this.get('model.scene.id'),
      title: this.get('model.scene.title'), 
      icdate: this.get('model.scene.icdate'),
      scene_type: this.get('model.scene.scene_type'),
      scene_pacing: this.get('model.scene.scene_pacing'),
      location: this.get('model.scene.location'),
      summary: this.get('model.scene.summary'),
      privacy: this.get('model.scene.privacy'),
      plots: (this.get('model.scene.plots') || []).map(p => p.id),
      participants: (this.get('model.scene.participants') || []).map(p => p.name),
      related_scenes: (this.get('model.scene.related_scenes') || []).map(s => s.id),
      tags: tags,
      content_warning: this.get('model.scene.content_warning'),
      limit: this.get('model.scene.limit'),
      log: this.get('model.scene.log')
    }, null)
    .then( (response) => {
      if (response.error) {
        return;
      }
                
      this.router.transitionTo('scene', this.get('model.scene.id'));
      this.flashMessages.success('Scene updated!');
    });
  }
});