import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import AvailableRoutes from 'ares-webportal/mixins/available-routes';
import AresConfig from 'ares-webportal/mixins/ares-config';

export default Controller.extend(AuthenticatedController, AvailableRoutes, AresConfig, {
    session: service(),
    gameSocket: service(),
    gameApi: service(),
    hideSidebar: false,
    refreshSidebar: false,
    showAltSelection: false,

    currentRoute: computed(function() {
        return window.location;
    }),    
    
    portalVersion: computed(function() {
      return aresweb_version;
    }),
    
    currentUser: reads('session.data.authenticated'),

    socketConnected: reads('gameSocket.connected'),

    sidebar: reads('model'),


    topNavbar: computed('model.top_navbar', function() {
      let config = this.get('model.top_navbar');
      let nav = [];
      let availableRoutes = this.availableRoutes();

      if (!config) {
        return [];
      }

      try {
        config.forEach(n => {
          let menuOK = true;
          try {
            if (n.menu) {
              n.menu.forEach(m => {
                if (!this.checkRoute(m, availableRoutes)) {
                  menuOK = false;
                }
              });
            } else {
              menuOK = this.checkRoute(n, availableRoutes);
            }
            if (menuOK) {
              nav.push(n); 
            } else {
              nav.push({ title: `MENU ERROR` });
            }
          }
          catch(error) {
            console.log(error);
            console.log(`Bad menu config under ${n.title}.`);
            nav.push({ title: `MENU ERROR` });
          }
        });
      }
      catch(error) {
        console.log(error);
        console.log("Bad menu config.");
        nav.push({ title: `MENU ERROR` });
      }
      return nav;
      
    }),
    
    versionWarning: computed('mushVersion', 'portalVersion', function() {
      return this.mushVersion != this.portalVersion;
    }),
    
    checkRoute: function(menu, availableRoutes) {
      let route = menu.route;
      if (route) {
      
         if (!availableRoutes.includes(route)) {
          console.log(`Bad route in menu: ${route}`);
          return false;
         }
     
         let routeHasId = this.routeHasId(route);
         if (menu.id && !routeHasId) {
           console.log(`Menu ${menu.title}:${route} has an ID when it shouldn't.`);
           return false;
         }
     
         if (routeHasId && (!menu.id && !menu.ids)) {
           console.log(`Menu ${menu.title}:${route} is missing ID.`);
           return false;
         }
         return true;
       } 
       return true;
    },
    
    actions: {
      switchAlt: function(alt) {
        this.set('showAltSelection', false);
        this.session.authenticate('authenticator:ares', { name: alt, password: 'ALT' })
         .then(() => {
           let redirect = this.currentRoute;
           if (!redirect) {
               redirect = '/';
           }
           window.location.replace(redirect);
         });
      },
      toggleAltSelection: function() {
        this.set('showAltSelection', !this.showAltSelection);
      }
    }
    
});