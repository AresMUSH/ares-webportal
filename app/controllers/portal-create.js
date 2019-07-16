import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    flashMessages: service(),
    gameApi: service(),
    session: service(),

    name: '',
    gms: '',
    creatures: '',
    primary_school: '',
    all_schools: '',
    location: '',
    location_known: '',
    latitude: '',
    longitude: '',
    sapient: '',
    pinterest: '',
    description: '',
    other_creatures: '',
    npcs: '',
    trivia: '',
    events: '',
    society: '',
    rp_suggestions: '',

    resetOnExit: function() {
      this.set('isKnown', false);
    },

    actions: {
        gmsChanged(new_gms) {
          this.set('model.portal.gms', new_gms);
        },
        creaturesChanged(new_creatures) {
          this.set('model.portal.creatures', new_creatures);
        },
        allschoolsChanged(new_schools) {
          this.set('model.portal.all_schools', new_schools);
        },
        primaryschoolChanged(new_school) {
          this.set('model.portal.primary_school', new_school);
        },
        save() {
            let api = this.get('gameApi');
            api.requestOne('portalCreate', {
               id: this.get('model.portal.id'),
               name: this.get('model.portal.name'),
               gms: (this.get('model.portal.gms') || []).map(gm => gm.name),
               creatures: (this.get('model.portal.creatures') || []).map(creature => creature.id),
               location: this.get('model.portal.location'),
               location_known: this.get('isKnown'),
               latitude: this.get('model.portal.latitude'),
               longitude: this.get('model.portal.longitude'),
               primary_school: this.get('model.portal.primary_school.name'),
               all_schools: (this.get('model.portal.all_schools') || []).map(s => s.name),
               pinterest: this.get('model.portal.pinterest'),
               description: this.get('model.portal.edit_desc'),
               other_creatures: this.get('model.portal.edit_other_creatures'),
               npcs: this.get('model.portal.edit_npcs'),
               trivia: this.get('model.portal.edit_trivia'),
               events: this.get('model.portal.edit_events'),
               rp_suggestions: this.get('model.portal.edit_rp_suggestions'),
               society: this.get('model.portal.edit_society')}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('portal',
                response.id);
                this.get('flashMessages').success('Portal created!');
            });
        }
    }
});
