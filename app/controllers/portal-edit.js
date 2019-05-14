import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    flashMessages: service(),
    gameApi: service(),

    actions: {
        gmsChanged(new_gms) {
          this.set('model.portal.gms', new_gms);
        },
        save() {
            let api = this.get('gameApi');
            api.requestOne('portalEdit', {
               id: this.get('model.portal.id'),
               name: this.get('model.portal.name'),
               gms: (this.get('model.portal.gms') || []).map(gm => gm.name),
               location: this.get('model.portal.location'),
               primary_school: this.get('model.portal.primary_school'),
               all_schools: this.get('model.portal.all_schools'),
               description: this.get('model.portal.description'),
               creatures: this.get('model.portal.creatures'),
               npcs: this.get('model.portal.npcs'),
               trivia: this.get('model.portal.trivia'),
               events: this.get('model.portal.events')}, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('portal',
                this.get('model.portal.id'));
                this.get('flashMessages').success('Portal updated!');
            });
        }
    }
});
