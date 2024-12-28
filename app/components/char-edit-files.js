import Component from '@ember/component';
import { action } from '@ember/object';
import { notifyPropertyChange } from '@ember/object';

export default Component.extend({
  tagName: '',

  @action
  fileUploaded(folder, name) {
    let model_folder = this.get('model.char.name').toLowerCase();
    if (folder === model_folder) {
      if (!this.get('model.char.files').some( f => f.name == name && f.folder == model_folder )) {
        this.get('model.char.files').push( { name: name, path: `${folder}/${name}` });
        notifyPropertyChange(this, 'model');        
      }
    }
  }
});
