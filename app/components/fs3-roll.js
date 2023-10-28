import Component from '@ember/component';
import { inject as service } from '@ember/service';

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
    controlled: false,
    risky: false,
    desperate: false,
    limited: false,
    standard: false,
    great: false,
    fortune: false,
    downtime: false,
    information: false,
    push: false,
    resist: false,
    devil: false,
    groupaction: false,
    destinationType: 'scene',

    didInsertElement: function() {
      this._super(...arguments);
      let defaultAbility = 'Survey';
      this.set('rollString', defaultAbility);
    },


    actions: { 
      
      addRoll() {
        let api = this.gameApi;
        let defaultAbility = 'Survey';
      
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
      
        if (pcRollSkill || pcRollName) {
          if (!pcRollSkill || !pcRollName) {
            this.flashMessages.danger("You have to provide all skill information to roll for a PC.");
            return;
          }
        }
        this.set('selectSkillRoll', false);
        this.set('rollString', null);
        this.set('vsRoll1', null);
        this.set('vsRoll2', null);
        this.set('vsName1', null);
        this.set('vsName2', null);
        this.set('pcRollSkill', null);
        this.set('pcRollName', null);
        this.set('controlled', false);
        this.set('risky', false);
        this.set('desperate', false);
        this.set('limited', false);
        this.set('standard', false);
        this.set('great', false);
        this.set('downtime', false);
        this.set('resist', false);
        this.set('fortune', false);
        this.set('information', false);
        this.set('downtime', false);
        this.set('devil', false);
        this.set('groupaction', false);
        this.set('push', false);

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
           sender: sender }, null)
        .then( (response) => {
          if (response.error) {
            return;
          }
        });
      },
    }
});
