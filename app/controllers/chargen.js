import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import FS3Chargen from 'ares-webportal/mixins/fs3-chargen';

export default Controller.extend(FS3Chargen, {    
    flashMessages: service(),
    gameApi: service(),
    charErrors: [],
    toggleCharChange: false,
    
    alerts: function() {
        return this.get('charErrors');
    }.property('toggleCharChange'),
    
    genders: function() {
        return [ { value: 'Male' }, { value: 'Female' }, { value: 'Other' }];
    }.property(),

    showCharErrors: function() {
        return this.get('alerts').length > 0;
    }.property('alerts'),

    
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
            fullname: this.get('model.char.fullname'),
            demographics: this.get('model.char.demographics'),
            groups: this.get('model.char.groups'),
            desc: this.get('model.char.desc'),
            shortdesc: this.get('model.char.shortdesc'),
            rp_hooks: this.get('model.char.rp_hooks'),
            background: this.get('model.char.background'),
            fs3: this.buildFs3QueryData()
        };
    }, 
    
    
    toggleCharChanged: function() {
        this.set('toggleCharChange', !this.get('toggleCharChange'));        
    },
    
    actions: {
        
        genderChanged(val) {
            this.set('model.char.demographics.gender.value', val.value);
            this.validateChar();
        },
        
        groupChanged(group, val) {
            this.set(`model.char.groups.${group}`, val);
            this.validateChar();
        },
        
        reset() {
            let api = this.get('gameApi');
            api.requestOne('chargenReset', { char: this.buildQueryDataForChar() })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.send('reloadModel');
                this.flashMessages.success('Abilities reset.');
            });    
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
                this.validateChar();
                if (response.alerts) {
                    response.alerts.forEach( r => this.charErrors.push(r) );
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