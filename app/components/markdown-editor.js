import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default Component.extend({
  previewText: null,
  rows: 6,
  gameApi: service(),
  text: '',
  
  get markdownText() {
    return this.text || "";
  },
    
  @action
  showHelp() {
    window.open("/help/markdown");
  },
    
  @action
  preview() {
    if (this.get('previewText.length') > 0) {
      this.set('previewText', null);
      return;
    }
    let api = this.gameApi;
      
    api.requestOne('markdownPreview', { text: this.text })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.set('previewText', response.text);
    });
  },
  
  @action
  onChange(value) {  
    this.set('text', value);
  },
  
  @action
  onInit(editor) {  
    setTimeout(() => editor.blur());
    setTimeout(() => window.scrollTo(0, 0));
  },
  
  @action
  keyDown(event) {
    if (event.keyCode == 13) {
      if (event.ctrlKey || event.metaKey) {
        
        // Needed because onEnter is optional - we don't want to trigger it if it's not set.
        if (this.onEnter) {
          this.onEnter();
        }      
        
        event.preventDefault();
      }
    }
  }    
});
