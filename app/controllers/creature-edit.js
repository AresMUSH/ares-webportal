import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    flashMessages: service(),
    gameApi: service(),

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
        majorschoolChanged(new_schools) {
          this.set('model.creature.major_school', new_schools);
        },
        minorschoolChanged(new_school) {
          this.set('model.creature.minor_school', new_school);
        },
        save() {
            let api = this.get('gameApi');
            api.requestOne('creatureEdit', {
               id: this.get('model.creature.id'),
               name: this.get('model.creature.name'),
               gms: (this.get('model.creature.gms') || []).map(gm => gm.name),
               // portals: this.get('model.creature.portals'),
               major_school: this.get('model.creature.major_school').name,
               minor_school: this.get('model.creature.minor_school').name,
               sapient: this.get('isSapient'),
               pinterest: this.get('model.creature.pinterest'),
               found: this.get('model.creature.found'),
               language: this.get('model.creature.language'),
               traits: this.get('model.creature.edit_traits'),
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
