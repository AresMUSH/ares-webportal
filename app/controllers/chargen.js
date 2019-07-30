import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    flashMessages: service(),
    gameApi: service(),
    charErrors: [],
    toggleCharChange: false,
    fs3Data: {},

    genders: function() {
        return [ { value: 'Male' }, { value: 'Female' }, { value: 'Other' }];
    }.property(),

    anyGroupMissing: function() {
        let groups = this.get('model.char.groups');
        let anyMissing = false;

        Object.keys(groups).forEach(g => {
            if (!groups[g].value) {
                anyMissing = true;
            }
        });
        return anyMissing;
    }.property('toggleCharChange', 'model'),

    buildQueryDataForChar: function() {

        return {
            id: this.get('model.char.id'),
            demographics: this.get('model.char.demographics'),
            groups: this.get('model.char.groups'),
            desc: this.get('model.char.desc'),
            shortdesc: this.get('model.char.shortdesc'),
            lore_hook_pref: this.get('model.char.lore_hook_pref'),
            rp_hooks: this.get('model.char.rp_hooks'),
            profile_image: this.get('model.char.profile_image'),
            background: this.get('model.char.background'),
            lastwill: this.get('model.char.lastwill'),
            fs3: this.fs3Data
        };
    },


    toggleCharChanged: function() {
        this.set('toggleCharChange', !this.toggleCharChange);
    },

    actions: {

        secretPrefChanged(val) {
            this.set('model.char.secretpref', val);
        },

        lorehookPrefChanged(val) {
            this.set('model.char.lore_hook_pref', val);
        },

        genderChanged(val) {
           this.set('model.char.demographics.gender.value', val.value);
        },

        groupChanged(group, val) {
            this.set(`model.char.groups.${group}`, val);
        },

        fileUploaded(folder, name) {
          folder = folder.toLowerCase();
          name = name.toLowerCase();
          this.set('model.char.profile_image', `${folder}/${name}`);
        },

        review() {
            let api = this.gameApi;
            api.requestOne('chargenSave', { char: this.buildQueryDataForChar() })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('chargen-review');
            });
        },

        reset() {
          let api = this.gameApi;
          api.requestOne('chargenReset', { char: this.buildQueryDataForChar() })
          .then( (response) => {
            if (response.error) {
              return;
            }
            this.send('reloadModel');
            this.flashMessages.success('Abilities reset.');
          });
        },

        save() {
            let api = this.gameApi;
            api.requestOne('chargenSave', { char: this.buildQueryDataForChar() })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                if (response.alerts) {
                  response.alerts.forEach( r => this.charErrors.pushObject(r) );
                }
                this.flashMessages.success('Saved!');
            });
        },

        unsubmit() {
            let api = this.gameApi;
            api.requestOne('chargenUnsubmit')
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.send('reloadModel');
            });
        }
    }
});
