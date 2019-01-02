import Mixin from '@ember/object/mixin';

export default Mixin.create({

    attrPoints: function() {
        let total = this.countPointsInGroup(this.get('model.char.fs3.fs3_attributes'), 0, 2, 2);
        return total;
    }.property('model.char.fs3.fs3_attributes.@each.rating'),

    countPointsInGroup: function(list, free_points, max_free_rating, cost_per_rating) {
        if (!list) {
            return;
        }
        let points = 0;
        list.forEach(function (ability) {
            let rating = ability.rating;
            if (rating > max_free_rating) {
                points = points + ((rating - max_free_rating) * cost_per_rating);
            }
        });

        return (points <= free_points) ? 0 : (points - free_points);
    },

    buildFs3QueryData: function() {
        if (this.get('model.app.game.disabled_plugins.fs3skills')) {
            return {};
        }

        let specialties = {};
        let actionSkills = this.get('model.char.fs3.fs3_action_skills')

        if (actionSkills) {
        actionSkills.forEach(function (ability) {
            if (ability.specialties) {
                let selectedSpecs = ability.specialties.filter( s => s.selected ).map(s => s.name);
                specialties[ability.name] = selectedSpecs;
                }
            });
        }

        return {
            fs3_attributes: this.createAbilityHash(this.get('model.char.fs3.fs3_attributes')),
            fs3_action_skills: this.createAbilityHash(this.get('model.char.fs3.fs3_action_skills')),
            fs3_backgrounds: this.createAbilityHash(this.get('model.char.fs3.fs3_backgrounds')),
            fs3_languages: this.createAbilityHash(this.get('model.char.fs3.fs3_languages')),
            fs3_advantages: this.createAbilityHash(this.get('model.char.fs3.fs3_advantages')),
            fs3_specialties: specialties
        };
    },


    createAbilityHash: function(ability_list) {
        if (!ability_list) {
            return {};
        }
        return ability_list.reduce(function(map, obj) {
                map[obj.name] = obj.rating;
                return map;
                }, {});
    },

    skillPoints: function() {
        let total = 0;
        total = total + this.countPointsInGroup(this.get('model.char.fs3.fs3_action_skills'), 0, 1, 1);
        total = total + this.countPointsInGroup(this.get('model.char.fs3.fs3_backgrounds'), this.get('model.cgInfo.fs3.free_backgrounds'), 0, 1);
        total = total + this.countPointsInGroup(this.get('model.char.fs3.fs3_languages'), this.get('model.cgInfo.fs3.free_languages'), 0, 1);
        total = total + this.countPointsInGroup(this.get('model.char.fs3.fs3_advantages'), 0, 0, this.get('model.cgInfo.fs3.advantages_cost'));
        return total;
    }.property('model.char.fs3.fs3_backgrounds.@each.rating', 'model.char.fs3.fs3_action_skills.@each.rating', 'model.char.fs3.fs3_languages.@each.rating', 'model.char.fs3.fs3_advantages.@each.rating'),

    actionPoints: function() {
        let total = 0;
        total = total + this.countPointsInGroup(this.get('model.char.fs3.fs3_action_skills'), 0, 1, 1);
        return total;
    }.property('model.char.fs3.fs3_action_skills.@each.rating'),

    checkLimits: function(list, limits, title) {
        if (!list) {
            return;
        }

        for (var high_rating in limits) {
            let limit = limits[high_rating];
            let high = list.filter(l => l.rating >= high_rating);
            let count = high.length;
            if (count > limit) {
                this.charErrors.push(`You can only have ${limit} ${title} at ${high_rating}+.`);
            }
        }
    },

    validateChar: function() {
        this.set('charErrors', []);

        this.checkLimits(this.get('model.char.fs3.fs3_action_skills'), this.get('model.cgInfo.fs3.skill_limits'), 'action skills');
        this.checkLimits(this.get('model.char.fs3.fs3_attributes'), this.get('model.cgInfo.fs3.attr_limits'), 'attributes');

        // Magic
        let magicAttr = this.get('model.char.fs3.fs3_attributes').filter(a => a.name === 'Magic');
        let magicRating = magicAttr ? magicAttr.rating : 0;

        if (magicRating > 1) {
            this.charErrors.push('Magic cannot be higher than 1.');
        }

        let totalAttrs = this.get('attrPoints');
        let totalSkills = this.get('skillPoints');
        let totalAction = this.get('actionPoints');
        let maxAttrs = this.get('model.cgInfo.fs3.max_attrs');
        if (totalAttrs > maxAttrs) {
            this.charErrors.push(`You can only spend ${maxAttrs} points in attributes.  You have spent ${totalAttrs}.`);
        }

        let maxAction = this.get('model.cgInfo.fs3.max_action');
        if (totalAction > maxAction) {
            this.charErrors.push(`You can only spend ${maxAction} points in action skills.  You have spent ${totalAction}.`);
        }

        let maxAp = this.get('model.cgInfo.fs3.max_ap');
        let totalAp = totalAttrs + totalSkills;
        if (totalAp > maxAp) {
            this.charErrors.push(`You can only spend ${maxAp} ability points.  You have spent ${totalAp}.`);
        }

        this.toggleCharChanged();
    },

    actions: {
        addBackgroundSkill() {
            this.get('model.char.fs3.fs3_backgrounds').pushObject( Ember.Object.create( { name: "Enter Skill Name" , rating: 1, rating_name: 'Fair' }) );
            this.validateChar();
        },

        abilityChanged() {
            this.validateChar();
        }
    }

});
