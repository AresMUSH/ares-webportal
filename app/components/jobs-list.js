import Component from '@ember/component';

export default Component.extend({
  
    actions: {
        goToPage(newPage) { 
          this.sendAction('goToPage', newPage);
        }
    }
});
