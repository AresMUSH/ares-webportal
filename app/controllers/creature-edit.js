import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    flashMessages: service(),
    gameApi: service(),

    actions: {
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
            api.requestOne('creatureEdit', {
              id: this.get('model.creature.id'),
              name: this.get('model.creature.name'),
              gms: (this.get('model.creature.gms') || []).map(gm => gm.name),
              banner_image: this.get('model.creature.banner_image.name'),
              profile_image: this.get('model.creature.profile_image.name'),
              image_gallery: this.get('model.creature.image_gallery'),
              sapient: this.get('model.creature.sapient'),
              pinterest: this.get('model.creature.pinterest'),
              speed: this.get('model.creature.speed'),
              length: this.get('model.creature.length'),
              height: this.get('model.creature.height'),
              found: this.get('model.creature.found'),
              combat: this.get('model.creature.edit_combat'),
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
                this.get('model.creature.id'));
                this.get('flashMessages').success('Creature updated!');
            });
        }
    }
});
