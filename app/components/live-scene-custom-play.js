import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  selectCastSpell: false,
  mod: null,
  target_name: null,
  gameApi: service(),
  flashMessages: service(),
  tagName: '',


  actions: {

    addSceneSpell() {
      let api = this.gameApi;

        // Needed because the onChange event doesn't get triggered when the list is
        // first loaded, so the roll string is empty.
      let spellString = this.custom.spellString || this.spells[0];
      let mod = this.custom.mod;
      let targetName = this.custom.targetName;

        if (!spellString) {
            this.flashMessages.danger("You haven't selected a spell to cast.");
            return;
        }
        this.set('selectCastSpell', false);
        this.set('spellString', null);
        this.set('targetName', null);
        this.set('mod', null);

        api.requestOne('addSceneSpell', {
          scene_id: this.scene.id,
          target_name: targetName,
          mod: mod,
          spell_string: spellString
        }, null)

        .then( (response) => {
            if (response.error) {
              this.flashMessages.danger(response.error);
                return;
            }
        });
      }


  }
});
