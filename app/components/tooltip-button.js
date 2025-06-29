import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  tagName: 'span',
  onClick: null, // This is a callback we provide for handling the button click
  
  @action
  handleClick() {
    if (this.onClick) {
      this.onClick();
    }
  }
  
});
