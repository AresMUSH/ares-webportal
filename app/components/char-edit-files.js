import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  tagName: '',

  @action
  fileUploaded(folder, name) {
    let model_folder = this.get('model.char.name').toLowerCase();
    if (folder === model_folder) {
      if (!this.get('model.char.files').some( f => f.name == name && f.folder == model_folder )) {
        this.get('model.char.files').pushObject( { name: name, path: `${folder}/${name}` });
      }
    }
  }
});
