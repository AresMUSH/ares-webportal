import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({    
    aresconfig: computed(function() {
      return window.aresconfig || null;
    }),
    
    mushName: computed(function() { 
        return this.get('aresconfig.game_name');
    }),
    
    mushPort: computed(function() {
        return this.get('aresconfig.mush_port'); 
    }),
    
    mushHost: computed(function() {
        return this.get('aresconfig.host');
    }),
    
    mushVersion: computed(function() {
        return this.get('aresconfig.version');
    }),
    
    websocketPort: computed(function() {
      return this.get('aresconfig.websocket_port');
    }),
    
    webPortalPort: computed(function() {
      return this.get('aresconfig.web_portal_port');
    }),
    
    httpsEnabled: computed(function() {
      return this.get('aresconfig.use_https');
    }),
    
    apiProxyEnabled: computed(function() {
      return this.get('aresconfig.use_api_proxy');
    }),
    
    apiPort: computed(function() {
      return this.get('aresconfig.api_port');
    }),
    
    apiKey: computed(function() {
      return this.get('aresconfig.api_key');
    }),
    
    // Technically not part of aresconfig, but here for parity with the mushVersion.
    webPortalVersion: computed(function() {
      return aresweb_version;
    }),
    versionWarning: computed('mushVersion', 'webPortalVersion', function() {
      return this.mushVersion != this.webPortalVersion;
    })
    
    
});

