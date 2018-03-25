import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    text: '',
    preview: null,
    rows: 6,
    gameApi: service(),
    
    actions: { 
        onEnter() {
            this.send('onEnter');  
        },
        preview() {
            if (this.get('preview.length') > 0) {
                this.set('preview', null);
                return;
            }
            let api = this.get('gameApi');
            
            api.requestOne('markdownPreview', { text: this.get('text') })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('preview', response.text);
            });
        },
        showHelp() {
            window.open("/help/markdown");
        }
    }
});
