import Component from '@ember/component';

export default Component.extend({
   
    actions: { 
        learnAbility(ability) {
            this.sendAction('learnAbility', ability);
        }
    }
});
