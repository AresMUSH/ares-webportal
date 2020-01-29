import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    resetEditor: null,  // This will be set to a function by the component binding.  We can call that function to reset the editor text.
  
    handleSave: function() {
        let api = this.gameApi;
        api.requestOne('saveTinker', { text: this.get('model.text') }, null)
        .then( (response) => {
            if (response.error) {
                return;
            }
        
        this.flashMessages.success('File saved!  You can now use the tinker command in-game.');
        });  
    },
    actions: {
        editorChanged: function(text) {
            this.set('model.text', text);
        },
        reset: function() {
            this.resetEditor(this.get('model.default'));
            this.handleSave();
        },
        save: function() { 
            this.handleSave();
        }
    }
});

