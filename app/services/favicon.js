import $ from "jquery"
import Service from '@ember/service';

export default Service.extend({
    
  changeFavicon(active) {
        var src = '/game/uploads/theme_images/favicon.ico';
        if (active) { 
            src = '/game/uploads/theme_images/favicon-active.ico';
        }
        $('link[rel="shortcut icon"]').attr('href', src);
        
    },
     
});