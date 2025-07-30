import Service from '@ember/service';

export default Service.extend({
    
  setEditorPreference(pref) {
      // Save editor cookie
      window.localStorage.setItem("aresmush:editor", pref || "WYSIWYG");        
    },
  editorPreference() {
      return window.localStorage.getItem("aresmush:editor") || "WYSIWYG";
    }
     
});