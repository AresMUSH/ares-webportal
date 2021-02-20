import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    queryParams: [ 'location' ],
    warning_tags: [],

    scenePacingOptions: computed(function() { 
        return this.get('model.sceneOptions.scene_pacing');
    }),    
    sceneTypes: computed(function() { 
        return this.get('model.sceneOptions.scene_types').map(p => p.name);
    }),
    
    scenePrivacyValues: computed(function() { 
        return [ 'Open', 'Private' ];
    }),
    
    actions: {
        plotsChanged(newPlots) {
            this.set('model.scene.plots', newPlots);
        },
        typeChanged(newType) {
            this.set('model.scene.scene_type', newType);
        },
        pacingChanged(newType) {
            this.set('model.scene.scene_pacing', newType);
        },
        participantsChanged(newParticipants) {
            this.set('model.scene.participants', newParticipants);
        },
        relatedChanged(newRelated) {
          this.set('model.scene.related_scenes', newRelated);
        },
        privacyChanged(newPrivacy) {
          this.set('model.scene.privacy', newPrivacy);
        },
        locationSelected(newLocation) {
          this.set('model.scene.location', newLocation);
        },
        warningsChanged(new_warnings) {
          this.set('warning_tags', new_warnings);
          this.set('model.scene.content_warning', new_warnings.join(', '));
        },
        save() {
            let api = this.gameApi;
            let tags = this.get('model.scene.tags') || [];
            if (!Array.isArray(tags)) {
                tags = tags.split(/[\s,]/);
            }
            
            api.requestOne('createScene', { 
               title: this.get('model.scene.title'), 
               icdate: this.get('model.scene.icdate'),
               scene_type: this.get('model.scene.scene_type'),
               scene_pacing: this.get('model.scene.scene_pacing'),
               location: this.get('model.scene.location'),
               summary: this.get('model.scene.summary'),
               plots: (this.get('model.scene.plots') || []).map(p => p.id),
               completed: this.get('model.scene.completed'),
               privacy: this.get('model.scene.privacy'),
               participants: (this.get('model.scene.participants') || []).map(p => p.name),
               related_scenes: (this.get('model.scene.related_scenes') || []).map(s => s.id),
               tags: tags,
               content_warning: this.get('model.scene.content_warning'),
               limit: this.get('model.scene.limit'),
               log: this.get('model.scene.log')}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('scene',                          
                          response.id);
                this.flashMessages.success('Scene updated!');
            });
        }
    }
});