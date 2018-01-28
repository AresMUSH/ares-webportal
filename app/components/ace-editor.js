import Component from '@ember/component';

export default Component.extend({
    mode: 'yaml',  // Can also be html_ruby, plain_text or markdown
    text: '',
    editorId: '',
    lines: 20,
    
    updateText: function() {
        var editor = ace.edit(this.get('editorId'));
        if (editor.getValue() != this.get('text')) {
            editor.setValue(this.get('text'), -1);
        }
    }.observes('text'),
    
    didInsertElement: function() {
        var editor = ace.edit(this.get('editorId'));
        editor.setTheme("ace/theme/cobalt");
        editor.setOption("maxLines", this.get('lines'));
        editor.getSession().setMode(`ace/mode/${this.get('mode')}`);
        editor.$blockScrolling = Infinity;
        let self = this;
        
        editor.getSession().on('change', function() {
            self.set('text', editor.getValue());
        }); 
      
    }
});
