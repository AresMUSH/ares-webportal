import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
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
    
    mushName: computed(function() { 
        return aresconfig.game_name;
    }),
    
    mushPort: computed(function() {
        return aresconfig.mush_port;        
    }),
    
    mushHost: computed(function() {
        return aresconfig.host;        
    }),
    
    mushVersion: computed(function() {
        return aresconfig.version;
    }),
    
    portalVersion: computed(function() {
      return aresweb_version;
    }),
    
    currentUser: computed('session.data.authenticated', function() {
        return this.get('session.data.authenticated');
    }),
    
    socketConnected: computed('gameSocket.connected', function() {
      return this.get('gameSocket.connected');
    }),
    
    sidebar: computed('refreshSidebar', function() {
        return this.model;
    }),

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
            n.menu.forEach(m => {
              let route = m.route;
              if (route) {
                
               if (!availableRoutes.includes(route)) {
                console.log(`Bad route in menu: ${route}`);
                menuOK = false;
               }
               
               let routeHasId = this.routeHasId(route);
               if (m.id && !routeHasId) {
                 console.log(`Menu ${route} has an ID when it shouldn't.`);
                 menuOK = false;
               }
               
               if (!m.id && routeHasId) {
                 console.log(`Menu ${route} is missing ID.`);
                 menuOK = false;
               }
             }
            });
            if (menuOK) {
              nav.push(n); 
            } else {
              nav.push({ title: `MENU ERROR` });
            }
          }
          catch(error) {
            console.log(`Bad menu config under ${n.title}.`);
            nav.push({ title: `MENU ERROR` });
          }
        });
      }
      catch(error) {
        console.log("Bad menu config.");
        nav.push({ title: `MENU ERROR` });
      }
      return nav;
      
    }),
    
    versionWarning: computed('mushVersion', 'portalVersion', function() {
      return this.get('mushVersion') != this.get('portalVersion');
    }),
    
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