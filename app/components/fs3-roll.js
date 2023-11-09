import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
    gameApi: service(),
    flashMessages: service(),
    tagName: '',
    selectSkillRoll: false,
    vsRoll1: null,
    vsRoll2: null,
    vsName1: null,
    vsName2: null,
    pcRollSkill: null,
    pcRollName: null,
    rollString: null,
    rollSelection: null,
    rollPosition: null,
    controlled: computed('rollPosition', function() {
        return this.rollPosition === 'controlled';
      }),
    risky: computed('rollPosition', function() {
        return this.rollPosition === 'risky';
      }),
    desperate: computed('rollPosition', function() {
        return this.rollPosition === 'desperate';
      }),
    rollEffect: null,
    limited: computed('rollEffect', function() {
        return this.rollEffect === 'limited';
      }),
    
    standard: computed('rollEffect', function() {
        return this.rollEffect === 'standard';
      }),
    
    great: computed('rollEffect', function() {
        return this.rollEffect === 'great';
      }),
    fortune: false,
    downtime: false,
    information: false,
    push: false,
    resist: false,
    devil: false,
    groupaction: false,
    assist: false,
    none: false,
    destinationType: 'scene',

    didInsertElement: function() {
      this._super(...arguments);
      let defaultAbility = this.abilities ? this.abilities[0] : '';
      this.set('rollString', defaultAbility);
    },


    actions: { 

      updateRollSelection(rollSelection) {
        // Reset the options
        this.set('resist', false);
        this.set('information', false);
        this.set('downtime', false);
        this.set('fortune', false);
        this.set('rollPosition', '');
        this.set('rollEffect', '');
        this.set('push', false);
        this.set('devil', false);
        this.set('groupaction', false);
        this.set('assist', false);
        this.set('none', false);
    
        // Update the roll selection
        this.set('rollSelection', rollSelection);
      },

      updateCheckboxes(checkboxName) {
        this.setProperties({
          resist: false,
          information: false,
          downtime: false,
          fortune: false,
          [checkboxName]: true
        });
      },


      addRoll() {
        let api = this.gameApi;
        let defaultAbility = this.abilities ? this.abilities[0] : '';
      
        // Needed because the onChange event doesn't get triggered when the list is 
        // first loaded, so the roll string is empty.
        let rollString = this.rollString || defaultAbility;
        let vsRoll1 = this.vsRoll1;
        let vsRoll2 = this.vsRoll2;
        let vsName1 = this.vsName1;
        let vsName2 = this.vsName2;
        let pcRollSkill = this.pcRollSkill;
        let pcRollName = this.pcRollName;
        let controlled = this.controlled;
        let risky = this.risky;
        let desperate = this.desperate;
        let limited = this.limited;
        let standard = this.standard;
        let great = this.great;
        let fortune = this.fortune;
        let downtime = this.downtime;
        let information = this.information;
        let push = this.push;
        let resist = this.resist;
        let devil = this.devil;
        let groupaction = this.groupaction;
        let rollPosition = this.rollPosition;
        let rollEffect = this.rollEffect;
        let rollSelection = this.rollSelection;
        let assist = this.assist;


        
        var sender;
        if (this.scene) {
          sender = this.get('scene.poseChar.name');
        }
          
        if (!rollString && !vsRoll1 && !pcRollSkill) {
          this.flashMessages.danger("You haven't selected an ability to roll.");
          return;
        }
      
        if (vsRoll1 || vsRoll2 || vsName1 || vsName2) {
          if (!vsRoll2 || !vsName1 || !vsName2) {
            this.flashMessages.danger("You have to provide all opposed skill information.");
            return;
          }
        }

        if (!this.rollSelection) {
          this.flashMessages.danger("You haven't selected a roll type.");
          return;
        }

        if (this.rollSelection === 'action' && (this.rollPosition === null || this.rollEffect === null)) {
            this.flashMessages.danger('Please select both Position and Effect for Action Roll.');
            return;
        }

        if (this.rollSelection === 'other' && information !== true && resist !== true && downtime !== true && fortune !== true) {
            this.flashMessages.danger("You haven't selected any of the other roll types.");
            return;
        }

        if (pcRollSkill || pcRollName) {
          if (!pcRollSkill || !pcRollName) {
            this.flashMessages.danger("You have to provide all skill information to roll for a PC.");
            return;
          }
        }
       // I just want it known to whoever reads this that at this point I am powered by grilled cheese and spite.
        this.set('selectSkillRoll', false);
        this.set('rollString', null);
        this.set('vsRoll1', null);
        this.set('vsRoll2', null);
        this.set('vsName1', null);
        this.set('vsName2', null);
        this.set('pcRollSkill', null);
        this.set('pcRollName', null);
        this.set('rollPosition', null);
        this.set('rollEffect', null);
        this.set('rollSelection', null);
        this.set('downtime', false);
        this.set('resist', false);
        this.set('fortune', false);
        this.set('information', false);
        this.set('downtime', false);
        this.set('devil', false);
        this.set('groupaction', false);
        this.set('push', false);
        this.set('assist', false);
        this.set('none', false);
      // so much spite.
        var destinationId, command;
        if (this.destinationType == 'scene') {
          destinationId = this.get('scene.id');
          command = 'addSceneRoll';
        }
        else {
          destinationId = this.get('job.id');
          command = 'addJobRoll'
        }
        
        api.requestOne(command, { id: destinationId,
           roll_string: rollString,
           vs_roll1: vsRoll1,
           vs_roll2: vsRoll2,
           vs_name1: vsName1,
           vs_name2: vsName2,
           pc_name: pcRollName,
           pc_skill: pcRollSkill,
           controlled_roll: controlled,
           risky_roll: risky,
           desperate_roll: desperate,
           limited_effect: limited,
           standard_effect: standard,
           great_effect: great,
           fortune_roll: fortune,
           downtime_roll: downtime,
           information_roll: information,
           push_roll: push,
           resist_roll: resist,
           devil_roll: devil,
           groupaction_roll: groupaction, 
           assist_roll: assist,          
           sender: sender }, null)
        .then( (response) => {
          if (response.error) {
            return;
          }
        });
      },
    }
});
