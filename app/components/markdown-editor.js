import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Component.extend({
  text: '',
  previewText: null,
  rows: 6,
  gameApi: service(),
    
  onEnter() {
    if (this.attrs.onEnter) {
      this.attrs.onEnter();
    }        
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
  keyDown(event) {
    if (event.keyCode == 13) {
      if (event.ctrlKey || event.metaKey) {
        this.onEnter();
        event.preventDefault();
      }
    }
  }    
});
