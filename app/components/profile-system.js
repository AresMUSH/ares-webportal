import Component from '@ember/component';

export default Component.extend({
   
    actions: { 
        abilityLearned() {
            this.sendAction('abilityLearned');
        }
    }
});
