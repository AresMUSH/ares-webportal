import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {
    fileUploaded(folder, name) {
        let model_folder = this.get('model.creature.name').toLowerCase();
        if (folder === model_folder) {
            if (!this.get('model.creature.files').some( f => f.name == name && f.folder == model_folder )) {
                this.get('model.creature.files').pushObject( { name: name, path: `${folder}/${name}` });
            }
        }
    }
  }
});
