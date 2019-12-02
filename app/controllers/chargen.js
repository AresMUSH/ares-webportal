import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({    
    flashMessages: service(),
    gameApi: service(),
    charErrors: null,
    fs3UpdateCallback: null,
    fs3ValidateCallback: null,

    init: function() {
      this._super(...arguments);
      this.set('charErrors', []);
    },
      
    genders: computed(function() {
      let list = [];
      this.get('model.cgInfo.genders').forEach(function(g) {
        list.push({ value: g });
      });
      return list;
    }),


    anyGroupMissing: computed('model', function() {
        let groups = this.get('model.char.groups');
        let anyMissing = false;
        
        Object.keys(groups).forEach(g => {
            if (!groups[g].value) {
                anyMissing = true;
            } 
        });
        return anyMissing;    
    }),
    
    buildQueryDataForChar: function() {
        
      let fs3 = this.fs3UpdateCallback ? this.fs3UpdateCallback() : null;
      
        return { 
            id: this.get('model.char.id'),
            demographics: this.get('model.char.demographics'),
            groups: this.get('model.char.groups'),
            desc: this.get('model.char.desc'),
            shortdesc: this.get('model.char.shortdesc'),
            rp_hooks: this.get('model.char.rp_hooks'),
            profile_image: this.get('model.char.profile_image'),
            background: this.get('model.char.background'),
            lastwill: this.get('model.char.lastwill'),
            fs3: fs3
        };
    }, 
    
    
    
    actions: {
        
        genderChanged(val) {
           this.set('model.char.demographics.gender.value', val.value);
        },
        
        groupChanged(group, val) {
          if (val) {
            this.set(`model.char.groups.${group}`, val);
          } else {
            this.set(`model.char.groups.${group}.value`, '');
            this.set(`model.char.groups.${group}.desc`, '');
          }
            
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
                this.charErrors.clear();
                if (this.fs3ValidateCallback) {
                  this.fs3ValidateCallback();
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