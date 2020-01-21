import Component from '@ember/component';

export default Component.extend({
    mode: 'yaml',  // Can also be html_ruby, plain_text or markdown
    text: '',
    editorId: '',
    lines: 20,
    resetEditorCallback: null, // This is a callback we provide for manually setting the text without the user typing.
    
    onReset: function(text) {
      this.set('text', text);
      var editor = ace.edit(this.editorId);
      editor.setValue(this.text, -1);
    },
    
    didInsertElement: function() {
        var editor = ace.edit(this.editorId);
        editor.setTheme("ace/theme/cobalt");
        editor.setOption("maxLines", this.lines);
        editor.getSession().setMode(`ace/mode/${this.mode}`);
        editor.$blockScrolling = Infinity;
        let self = this;
        
        editor.getSession().on('change', function() {
            self.set('text', editor.getValue());
        }); 
        
        this.set('resetEditorCallback', function(text) { return self.onReset(text); });
    }
});
