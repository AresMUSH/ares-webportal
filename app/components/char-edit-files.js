import Component from '@ember/component';
import { action } from '@ember/object';
import { pushObject } from 'ares-webportal/helpers/object-ext';

export default Component.extend({
  tagName: '',

  @action
  fileUploaded(folder, name) {
    let model_folder = this.get('model.char.name').toLowerCase();
    if (folder === model_folder) {
      if (!this.get('model.char.files').some( f => f.name == name && f.folder == model_folder )) {
        pushObject(this.get('model.char.files'), { name: name, folder: folder, path: `${folder}/${name}` }, this, 'model');
      }
    }
  }
});
