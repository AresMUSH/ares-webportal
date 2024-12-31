import { helper } from '@ember/component/helper';

export function scrollElementToBottom(elementName) {
  try {
    setTimeout(function() {
      let elementRef = document.getElementById(elementName);
      if (!elementRef) return;
      
      elementRef.scrollTo({ top: elementRef.scrollHeight, behavior: 'smooth' })      
    }, 100);            
  }
  catch(error) {
    // This happens sometimes when transitioning away from screen.
  }
}

export default helper(scrollElementToBottom);
