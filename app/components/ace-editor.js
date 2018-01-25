import Component from '@ember/component';

export default Component.extend({
    mode: 'yaml',  // Can also be html_ruby, plain_text or markdown
    text: '',
    
    updateText: function() {
        var editor = ace.edit("editor");
        if (editor.getValue() != this.get('text')) {
            editor.setValue(this.get('text'), -1);
        }
    }.observes('text'),
    
    didInsertElement: function() {
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/cobalt");
        editor.getSession().setMode(`ace/mode/${this.get('mode')}`);
        editor.$blockScrolling = Infinity;
        let self = this;
        
        editor.getSession().on('change', function() {
            self.set('text', editor.getValue());
        }); 
      
    }
});
