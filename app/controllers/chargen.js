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
            rp_hooks: this.get('model.char.rp_hooks'),
            background: this.get('model.char.background'),
            lastwill: this.get('model.char.lastwill'),
            fs3: this.get('fs3Data')
        };
    }, 
    
    
    toggleCharChanged: function() {
        this.set('toggleCharChange', !this.get('toggleCharChange'));        
    },
    
    actions: {
        
        genderChanged(val) {
            this.set('model.char.demographics.gender.value', val.value);
        },
        
        groupChanged(group, val) {
            this.set(`model.char.groups.${group}`, val);
        },
        
        review() {
            let api = this.get('gameApi');
            api.requestOne('chargenSave', { char: this.buildQueryDataForChar() })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('chargen-review');
            });   
        },
        
        save() {
            let api = this.get('gameApi');
            api.requestOne('chargenSave', { char: this.buildQueryDataForChar() })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                if (response.alerts) {
                  this.charErrors.replace();
                  response.alerts.forEach( r => this.charErrors.pushObject(r) );
                }
                this.flashMessages.success('Saved!');
            }); 
        },
        
        unsubmit() {
            let api = this.get('gameApi');
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