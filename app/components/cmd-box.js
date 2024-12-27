import { TextArea } from '@ember/legacy-built-in-components'

// No UI component - just some extra functionality on a standard TextArea
export default TextArea.extend({
    
    allowMultiLine: false,
  
    keyDown: function(event) {
      if (event.keyCode == 13) {
        if (event.ctrlKey || event.metaKey) {
          this.onEnter();
          event.preventDefault();
        }
        else if (!this.allowMultiLine) {
          this.onEnter();
          event.preventDefault();
        }
      }
    }
});
