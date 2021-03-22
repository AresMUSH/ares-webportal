import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    flashMessages: service(),
    gameApi: service(),
    session: service(),

    name: '',
    gms: '',
    portals: '',
    major_school: '',
    minor_school: '',
    sapient: '',
    pinterest: '',
    found: '',
    language: '',
    traits: '',
    society: '',
    magical_abilities: '',
    events: '',
    gms: null,
    short_desc: '',
    plots: '',

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
        portalsChanged(new_portals) {
          this.set('model.creature.portals', new_portals);
        },
        plotsChanged(new_plots) {
          this.set('model.creature.plots', new_plots);
        },
        majorschoolChanged(new_schools) {
          this.set('model.creature.major_school', new_schools);
        },
        minorschoolChanged(new_school) {
          this.set('model.creature.minor_school', new_school);
        },

        save() {
            let api = this.get('gameApi');
            api.requestOne('creatureCreate', {
              name: this.get('model.creature.name'),
               gms: (this.get('model.creature.gms') || []).map(gm => gm.name),
               portals: (this.get('model.creature.portals') || []).map(portal => portal.id),
               major_school: this.get('model.creature.major_school'),
               minor_school: this.get('model.creature.minor_school'),
               sapient: this.get('isSapient'),
               pinterest: this.get('model.creature.pinterest'),
               found: this.get('model.creature.found'),
               language: this.get('model.creature.language'),
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
