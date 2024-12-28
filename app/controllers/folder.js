import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import { action } from '@ember/object';
import { notifyPropertyChange } from '@ember/object';

export default Controller.extend(AuthenticatedController, {
  gameApi: service(),
  router: service(),

  showUpload: false,
  showMove: false,
  newFolder: '',
    
  resetOnExit: function() {
    this.set('showUpload', false);
    this.set('showMove', false);
    this.set('newFolder', '');
  },
    
  @action
  checkAll(checked) {
    this.model.files.forEach(f => set(f, "selected", checked));
  },
        
  @action
  startMove() {
    this.model.files.forEach(f => f.selected = true);
    this.set('showMove', true);
  },  
        
  @action
  move() {
    let newFolder = this.newFolder;

    this.set('showMove', false);
    this.set('newFolder', '');
          
    if (newFolder.length == 0) {
      this.flashMessages.danger("You must specify a folder name.");
      return;
    }
          
    let files = this.model.files.filter(f => f.selected).map(f => f.name);
    if (files.length == 0) {
      this.flashMessages.danger("You must select at least one file to move.");
      return;
    }

    this.gameApi.requestOne('moveFolder', 
    {
      folder: this.model.folder, 
      new_folder: newFolder, files: files 
    }, null)
    .then( (response) => {
      console.log(response.error);
      if (response.error) {
        return;
      }
      this.router.transitionTo('folder', response.folder);
      this.flashMessages.success('Folder moved!');
    });
  }, 
        
  @action   
  uploaded(folder, file) {
    let folderFound = false;
    let fileData = { folder: folder, name: file, path: `/${folder}/file` };
    this.model.forEach(function (f) {
      if (f.name === folder) {
        f.files.push( fileData );
        folderFound = true;
      }
    });
           
    if (!folderFound) {
      this.model.push( { name: folder, files: [ fileData ]});
    }
    notifyPropertyChange(this, 'model');    
  },
  
  @action
  setShowUpload(value) {
    this.set('showUpload', value);
  },
  
  @action
  setShowMove(value) {
    this.set('showMove', value);
  }
});