import Component from '@ember/component';

export default Component.extend({  
  damagePopupChar: null,
  
  actions: {
    showDamage(char) {
      this.set('damagePopupChar', char);
    }
  }  
});
