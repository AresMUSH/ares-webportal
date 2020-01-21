import EmberObject, { computed } from '@ember/object';
import { A } from '@ember/array';
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',
  newBgSkill: null,
  selectBackgroundSkill: false,
  flashMessages: service(),
  gameApi: service(),
  
  didInsertElement: function() {
    let self = this;
    this.set('updateCallback', function() { return self.onUpdate(); } );
    this.set('validateCallback', function() { return self.validateChar(); } );
    this.validateChar();
  },
  
  
  attrPoints: computed('model.char.fs3.fs3_attributes.@each.rating', function() {
    let total = this.countPointsInGroup(this.get('model.char.fs3.fs3_attributes'), 0, 2, 2);
    return total;
  }),
    
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
    
  onUpdate: function() {
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
      if (obj.name && obj.name.length > 0) {
        map[obj.name] = obj.rating;
      }
      return map;
    }, 
    {}
              
    );
  },
    
  skillPoints: computed('model.char.fs3.{fs3_backgrounds.@each.rating,fs3_action_skills.@each.rating,fs3_advantages.@each.rating,fs3_languages.@each.rating}', function() {
    let total = 0;
    total = total + this.countPointsInGroup(this.get('model.char.fs3.fs3_action_skills'), 0, 1, 1);
    total = total + this.countPointsInGroup(this.get('model.char.fs3.fs3_backgrounds'), this.get('model.cgInfo.fs3.free_backgrounds'), 0, 1);
    total = total + this.countPointsInGroup(this.get('model.char.fs3.fs3_languages'), this.get('model.cgInfo.fs3.free_languages'), 0, 1);
    total = total + this.countPointsInGroup(this.get('model.char.fs3.fs3_advantages'), 0, 0, this.get('model.cgInfo.fs3.advantages_cost'));
    return total;
  }),
    
  actionPoints: computed('model.char.fs3.fs3_action_skills.@each.rating', function() {
    let total = 0;
    total = total + this.countPointsInGroup(this.get('model.char.fs3.fs3_action_skills'), 0, 1, 1);
    return total;
  }),
     
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
    this.set('charErrors', A());
    this.checkLimits(this.get('model.char.fs3.fs3_action_skills'), this.get('model.cgInfo.fs3.skill_limits'), 'action skills');
    this.checkLimits(this.get('model.char.fs3.fs3_attributes'), this.get('model.cgInfo.fs3.attr_limits'), 'attributes');
        
    let emptyBgSkills = this.get('model.char.fs3.fs3_backgrounds').filter(s => !(s.name && s.name.length > 0));
    if (emptyBgSkills.length > 0) {
      this.charErrors.pushObject('Background skill names cannot be blank.  Set the skill to Everyman to remove it.');
    }
        
    let totalAttrs = this.attrPoints;
    let totalSkills = this.skillPoints;
    let totalAction = this.actionPoints;
    let maxAttrs = this.get('model.cgInfo.fs3.max_attrs');
    if (totalAttrs > maxAttrs) {
      this.charErrors.pushObject(`You can only spend ${maxAttrs} points in attributes.  You have spent ${totalAttrs}.`);
    }

    let maxAction = this.get('model.cgInfo.fs3.max_action');
    if (totalAction > maxAction) {
      this.charErrors.pushObject(`You can only spend ${maxAction} points in action skills.  You have spent ${totalAction}.`);
    }
        
    let maxAp = this.get('model.cgInfo.fs3.max_ap');
    let totalAp = totalAttrs + totalSkills;
    if (totalAp > maxAp) {
      this.charErrors.pushObject(`You can only spend ${maxAp} ability points.  You have spent ${totalAp}.`);
    }
  },
    
  actions: {
    addBackgroundSkill() {
      let skill = this.newBgSkill;
      if (!skill) {
        this.flashMessages.danger("You didn't specify a skill name.");
        this.set('selectBackgroundSkill', false);
        return;
      }
      if (!skill.match(/^[\w\s]+$/)) {
        this.flashMessages.danger("Skills can't have special characters in their names.");
        this.set('selectBackgroundSkill', false);
        return;
      }
      this.set('newBgSkill', null);
      this.set('selectBackgroundSkill', false);
      this.get('model.char.fs3.fs3_backgrounds').pushObject( EmberObject.create( { name: skill, rating: 1, rating_name: 'Fair' }) );  
      this.validateChar();
    },
        
    abilityChanged() {
      this.validateChar();
    },
    reset() {
      this.reset();
    }
  }
    
});
