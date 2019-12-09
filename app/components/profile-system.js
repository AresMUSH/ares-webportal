import Component from '@ember/component';

export default Component.extend({
   
    actions: { 
        reloadChar() {
            this.sendAction('reloadChar');
        }
    }
});
