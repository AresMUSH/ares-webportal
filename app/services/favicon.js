import Service from '@ember/service';

export default Service.extend({
    
  changeFavicon(active) {
        var src = '/game/uploads/theme_images/favicon.ico';
        if (active) { 
            src = '/game/uploads/theme_images/favicon-active.ico';
        }
        let iconElement = document.getElementById('favicon');
        iconElement.setAttribute('href',src);
    },
     
});