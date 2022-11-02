import $ from 'jquery';
import Service from '@ember/service';

var blinker = null;
var currSrc = null;

export default Service.extend({
  changeFavicon(active) {
    var src = '/game/uploads/theme_images/favicon.ico';
    var active_src = '/game/uploads/theme_images/favicon-active.ico';
    if (active) {
      if (blinker) {
        return;
      }

      currSrc = src;
      blinker = setInterval(() => {
        currSrc = currSrc === src ? active_src : src;
        $('link[rel="shortcut icon"]').attr('href', currSrc);
      }, 100);
    } else {
      clearInterval(blinker);
      blinker = null;
      $('link[rel="shortcut icon"]').attr('href', src);
    }
  },
});