import Component from '@ember/component';
import JsYaml from "js-yaml";
import { action } from '@ember/object';

export default Component.extend({
  text: '',
  warning: '',
  editorId: '',
    
  @action
  textChanged(evt) {
    this.set('warning', '');
    try {
      JsYaml.safeLoad(evt.target.value);
    }
    catch(error) {
      this.set('warning', `There may be a problem with your configuration YAML text: ${error.reason}.`);
    }
  },
});
