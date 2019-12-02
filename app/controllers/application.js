import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import AvailableRoutes from 'ares-webportal/mixins/available-routes';

export default Controller.extend(AuthenticatedController, AvailableRoutes, {
    session: service(),
    gameSocket: service(),
    gameApi: service(),
    hideSidebar: false,
    refreshSidebar: false,
    showAltSelection: false,
    sidebarModel: {},

    currentRoute: function() {
        return window.location;
    }.property(),
    
    mushName: function() { 
        return this.get('model.game.name');
    }.property(),
    
    mushPort: function() {
        return aresconfig.mush_port;        
    }.property(),
    
    mushHost: function() {
        return aresconfig.host;        
    }.property(),
    
    mushVersion: function() {
        return aresconfig.version;
    }.property(),
    
    portalVersion: function() {
      return aresweb_version;
    }.property(),
    
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
    
    actions: {
      switchAlt: function(alt) {
        this.set('showAltSelection', false);
        this.session.authenticate('authenticator:ares', { name: alt, password: 'ALT' })
         .then(() => {
           window.location.replace('/');
         });
      },
      toggleAltSelection: function() {
        this.set('showAltSelection', !this.showAltSelection);
      }
    }
    
});