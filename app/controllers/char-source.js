import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({    
    pageTitle: computed('model.char_name', function() {
        return this.get('model.char_name') + " Page Source";
    })
});