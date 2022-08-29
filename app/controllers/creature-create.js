import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    flashMessages: service(),
    gameApi: service(),
    session: service(),

    name: '',
    gms: '',
    sapient: '',
    pinterest: '',
    found: '',
    traits: '',
    society: '',
    magical_abilities: '',
    events: '',
    gms: null,
    short_desc: '',
    plots: '',
    combat: '',

    resetOnExit: function() {
      this.set('isSapient', false);
    },

    actions: {
        reset() {
          this.resetOnExit();
        },
        gmsChanged(new_gms) {
          this.set('model.creature.gms', new_gms);
        },
        plotsChanged(new_plots) {
          this.set('model.creature.plots', new_plots);
        },
        bannerImageChanged(image) {
          this.set('model.creature.banner_image', image);
        },
        profileImageChanged(image) {
            this.set('model.creature.profile_image', image);
        },
        save() {
            let api = this.get('gameApi');
            api.requestOne('creatureCreate', {
            name: this.get('model.creature.name'),
              gms: (this.get('model.creature.gms') || []).map(gm => gm.name),
              banner_image: this.get('model.creature.banner_image.name'),
              profile_image: this.get('model.creature.profile_image.name'),
              image_gallery: this.get('model.creature.image_gallery'),
              sapient: this.get('isSapient'),
              pinterest: this.get('model.creature.pinterest'),
              found: this.get('model.creature.found'),
              combat: this.get('model.creature.combat'),
              traits: this.get('model.creature.edit_traits'),
              short_desc: this.get('model.creature.edit_short_desc'),
              society: this.get('model.creature.edit_society'),
              magical_abilities: this.get('model.creature.edit_magical_abilities'),
              events: this.get('model.creature.edit_events')}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('creature',
                response.id);
                this.get('flashMessages').success('Creature created!');
            });
        }
    }
});
