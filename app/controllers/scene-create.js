import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),
    queryParams: [ 'location' ],

    sceneTypes: function() {
        return this.get('model.sceneTypes').map(p => p.get('name'));
    }.property('model'),

    scenePrivacyValues: function() {
        return [ 'Open', 'Private', 'Watchable' ];
    }.property(),

    actions: {
        plotChanged(newPlot) {
            this.set('model.scene.plot', newPlot);
        },
        creaturesChanged(new_creatures) {
          this.set('model.scene.creatures', new_creatures);
        },
        portalsChanged(new_portals) {
          this.set('model.scene.portals', new_portals);
        },
        typeChanged(newType) {
            this.set('model.scene.scene_type', newType);
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
               location: this.get('model.scene.location'),
               summary: this.get('model.scene.summary'),
               plot_id: this.get('model.scene.plot.id'),
               portals: (this.get('model.scene.portals') || []).map(portal => portal.id),
               creatures: (this.get('model.scene.creatures') || []).map(creature => creature.id),
               completed: this.get('model.scene.completed'),
               privacy: this.get('model.scene.privacy'),
               participants: (this.get('model.scene.participants') || []).map(p => p.name),
               related_scenes: (this.get('model.scene.related_scenes') || []).map(s => s.id),
               tags: tags,
               content_warning: this.get('model.scene.content_warning'),
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
