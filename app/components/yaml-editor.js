import Component from '@ember/component';
import JsYaml from "npm:js-yaml";

export default Component.extend({
    text: '',
    warning: '',
    editorId: '',
    
    didInsertElement: function() {
        
    },
    
    actions: {
        
        textChanged: function(evt) {
            this.set('warning', '');
            try {
                JsYaml.safeLoad(evt.target.value);
            }
            catch(error) {
                this.set('warning', `There may be a problem with your configuration YAML text: ${error.reason}.`);
            }
        },
    }
});
