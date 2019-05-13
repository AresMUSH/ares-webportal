import Controller from '@ember/controller';

export default Controller.extend({

    actions: {
        abilityLearned: function() {
            this.send('reloadModel');
        }
    }
    
});