import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    text: '',
    preview: null,
    rows: 6,
    ajax: service(),
    
    actions: { 
        onEnter() {
            this.send('onEnter');  
        },
        preview() {
            if (this.get('preview.length') > 0) {
                this.set('preview', null);
                return;
            }
            let aj = this.get('ajax');
            
            aj.requestOne('markdownPreview', { text: this.get('text') })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.set('preview', response.text);
            });
        },
    }
});
