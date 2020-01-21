import TextArea from '@ember/component/text-area';

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
