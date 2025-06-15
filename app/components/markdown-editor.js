import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';

export default Component.extend({
  previewText: null,
  rows: 0,
  gameApi: service(),
  text: '',
  hideToolbar: false,
  
  didInsertElement: function() {
    this._super(...arguments);
    this.set('hideToolbar', window.localStorage.getItem("aresmush:hideToolbar") === "true");
  },
    
  markdownText: computed('text', function() {
    return this.text || "";
  }),
  
  height: computed('rows', function() {
    if (this.rows === 0) {
      return "auto";
    }
    let minHeight = this.rows * 15;
    if (minHeight < 250) {
      minHeight = 250;
    }
    return `${minHeight}px`;
  }),
  
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
    //setTimeout(() => window.scrollTo(0, 0));
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
  },  
  @action
  toggleToolbar() {
    this.set('hideToolbar', !this.hideToolbar);
    window.localStorage.setItem("aresmush:hideToolbar", this.hideToolbar);
  }  
});
