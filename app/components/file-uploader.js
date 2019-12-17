import EmberObject, { computed } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    files: null,
    folder: '',
    allowMulti: true,
    lockProperties: false,
    gameApi: service(),
    flashMessages: service(),
    
    init: function() {
      this._super(...arguments);
      this.set('files', []);
    },
  
    fileCount: computed('files', function() {
        return this.get('files.length');
    }),
    
    showSelector: computed('fileCount', function() {
        return !this.fileCount;
    }),
    
    actions: {
        filesSelected: function(e) {
            let selectedFiles = e.target.files;
            let fileCount = selectedFiles.length;
            if (fileCount > 1 && !this.allowMulti) {
              this.flashMessages.danger('You can only upload a single file.');
              fileCount = 1;
            }
            let info = [];
            for (var i = 0; i < fileCount; i++) {
                let file = selectedFiles.item(i);
                let fileInfo = EmberObject.create( {
                    file: file,
                    name: file.name,
                    data: null,
                    folder: this.folder.toLowerCase(),
                    sizeKb: Math.round(file.size / 1000),
                    url: URL.createObjectURL(file)
                });
                
                var reader = new FileReader();
                reader.onload = (function(info) { return function(e) { info.data = e.target.result; }; })(fileInfo);
                reader.readAsDataURL(file);
                    
                info.push(fileInfo);
            }
            this.set('files', info);
        },
        
        removeFile: function(file) { 
            let newFiles = this.files;
            let filteredFiles = newFiles.filter(f => f != file);
            this.set('files', filteredFiles);
        },
        
        reset: function() {
            this.set('files', []);
        },
        
        uploadFile: function(file) {
            let api = this.gameApi;
            
            if (!file.data) {
                this.flashMessages.danger('That file is not ready for upload yet.  Give it a few more seconds.');
                return;
            }
            
            let folder = file.folder.toLowerCase();
            let name = file.name.toLowerCase();
            
            api.requestOne('uploadFile', {
                 name: name,
                 size_kb: file.sizeKb,
                 url: file.url,
                 data: file.data,
                 allow_overwrite: file.allowOverwrite,
                 folder: folder
               }, null)
            .then( (response) => {
                if (response.error) {
                    file.set('upload_message', `Upload Failed! ${response.error}`);
                    file.set('upload_success', false);
                }
                else {
                    file.set('upload_message', 'Upload Succeeded!');                    
                    file.set('upload_success', true);
                    
                    this.sendAction('uploaded', response.folder, response.name);
                }
            });
        }
    }
    
});
