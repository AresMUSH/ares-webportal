import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({    
    flashMessages: service(),
    ajax: service(),
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

    attrPoints: function() {
        let total = this.countPointsInGroup(this.get('model.char.fs3_attributes'), 0, 2, 2);
        return total;
    }.property('model.char.fs3_attributes.@each.rating'),
    
    countPointsInGroup: function(list, free_points, max_free_rating, cost_per_rating) {
        let points = 0;
        list.forEach(function (ability) {
            let rating = ability.rating;
            if (rating > max_free_rating) {
                points = points + ((rating - max_free_rating) * cost_per_rating);
            }
        });
        
        return (points <= free_points) ? 0 : (points - free_points);
    },
    
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
        let specialties = {};
        
        this.get('model.char.fs3_action_skills').forEach(function (ability) {
            if (ability.specialties) {
                
                let selectedSpecs = ability.specialties.filter( s => s.selected ).map(s => s.name);
                specialties[ability.name] = selectedSpecs;
            }
        });
        
        return { 
            id: this.get('model.char.id'),
            fullname: this.get('model.char.fullname'),
            demographics: this.get('model.char.demographics'),
            groups: this.get('model.char.groups'),
            desc: this.get('model.char.desc'),
            shortdesc: this.get('model.char.shortdesc'),
            rp_hooks: this.get('model.char.rp_hooks'),
            background: this.get('model.char.background'),
            fs3_attributes: this.createAbilityHash(this.get('model.char.fs3_attributes')),
            fs3_action_skills: this.createAbilityHash(this.get('model.char.fs3_action_skills')),
            fs3_backgrounds: this.createAbilityHash(this.get('model.char.fs3_backgrounds')),
            fs3_languages: this.createAbilityHash(this.get('model.char.fs3_languages')),
            fs3_specialties: specialties
        };
    }, 
    
    createAbilityHash: function(ability_list) {
        return ability_list.reduce(function(map, obj) {
                map[obj.name] = obj.rating;
                return map;
                }, {});
    },
    
    skillPoints: function() {
        let total = 0;
        total = total + this.countPointsInGroup(this.get('model.char.fs3_action_skills'), 0, 1, 1);
        total = total + this.countPointsInGroup(this.get('model.char.fs3_backgrounds'), 6, 0, 1);
        total = total + this.countPointsInGroup(this.get('model.char.fs3_languages'), 5, 0, 1);
        return total;
    }.property('model.char.fs3_backgrounds.@each.rating', 'model.char.fs3_action_skills.@each.rating', 'model.char.fs3_languages.@each.rating'),
     
    checkLimits: function(list, limits, title) {
        for (var high_rating in limits) {
            let limit = limits[high_rating];
            let high = list.filter(l => l.rating >= high_rating);
            let count = high.length;
            if (count > limit) {
                this.charErrors.push(`You can only have ${limit} ${title} at ${high_rating}+.`);
            }
        }
    },
    
    toggleCharChanged: function() {
        this.set('toggleCharChange', !this.get('toggleCharChange'));        
    },
    
    validateChar: function() {
        this.set('charErrors', []);

        this.checkLimits(this.get('model.char.fs3_action_skills'), this.get('model.cgInfo.skill_limits'), 'action skills');
        this.checkLimits(this.get('model.char.fs3_attributes'), this.get('model.cgInfo.attr_limits'), 'attributes');
        
        let totalAttrs = this.get('attrPoints');
        let totalSkills = this.get('skillPoints');
        let maxAttrs = this.get('model.cgInfo.max_attrs');
        if (totalAttrs > maxAttrs) {
            this.charErrors.push(`You can only spend ${maxAttrs} points in attributes.  You have spent ${totalAttrs}.`);
        }
        
        let maxAp = this.get('model.cgInfo.max_ap');
        let totalAp = totalAttrs + totalSkills;
        if (totalAp > maxAp) {
            this.charErrors.push(`You can only spend ${maxAp} ability points.  You have spent ${totalAp}.`);
        }
        
        this.toggleCharChanged();
    },
    
    
    actions: {
        addBackgroundSkill() {
            this.get('model.char.fs3_backgrounds').pushObject( Ember.Object.create( { name: "Enter Skill Name" , rating: 1, rating_name: 'Interest' }) );  
            this.validateChar();
        },
        
        abilityChanged() {
            this.validateChar();
        },
        
        genderChanged(val) {
            this.set('model.char.demographics.gender.value', val.value);
            this.validateChar();
        },
        
        groupChanged(group, val) {
            this.set(`model.char.groups.${group}`, val);
            this.validateChar();
        },
        
        reset() {
            let aj = this.get('ajax');
            aj.requestOne('chargenReset', { char: this.buildQueryDataForChar() })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.send('reloadModel', {});
                this.flashMessages.success('Abilities reset.');
            });    
        },
        
        review() {
            let aj = this.get('ajax');
            aj.requestOne('chargenSave', { char: this.buildQueryDataForChar() })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.transitionToRoute('chargen-review');
            });   
        },
        
        save() {
            let aj = this.get('ajax');
            aj.requestOne('chargenSave', { char: this.buildQueryDataForChar() })
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
            let aj = this.get('ajax');
            aj.requestOne('chargenUnsubmit')
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.send('reloadModel', {});
            }); 
        }
    }
});