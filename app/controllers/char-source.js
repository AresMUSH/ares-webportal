import Controller from '@ember/controller';

export default Controller.extend({    
    pageTitle: function() {
        return this.get('model.char_name') + " Page Source";
    }.property()
});