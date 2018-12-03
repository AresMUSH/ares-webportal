import Component from '@ember/component';
import TextArea from '@ember/component/text-area';

export default TextArea.extend({
    
    keyPress: function(event) {
      if (event.keyCode == 13) {
        this.sendAction('sendText');
        event.preventDefault();
      }
    }
});
