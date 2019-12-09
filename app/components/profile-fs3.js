import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  
  actions: { 
      reloadChar() {
          this.sendAction('reloadChar');
      }
  }
});
