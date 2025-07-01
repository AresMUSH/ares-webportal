import Service from '@ember/service';

export default Service.extend({
    
  setEditorPreference(pref) {
      // Save editor cookie
      window.localStorage.setItem("aresmush:editor", pref || "Classic");        
    },
  editorPreference() {
      return window.localStorage.getItem("aresmush:editor") || "Classic";
    }
     
});