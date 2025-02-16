import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  tagName: '',
  widgetId: '',

  didInsertElement: function () {
    this._super(...arguments);
    
    console.log("LLAMA");
    this.onResetAvail(this.resetTurnstile);
    let args = {
        sitekey: this.sitekey,
        callback: this.turnstileCallback
      };
    const id = turnstile.render("#turnstile-widget", args);
    this.set('widgetId', id);
  },
  
  @action
  turnstileCallback(response) {
    console.log(response);
    this.set('response', response);
  },
  
  @action
  resetTurnstile() {
    console.log(this.widgetId);
    turnstile.reset(this.widgetId);
  }
  
});
