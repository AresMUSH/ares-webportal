import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    flashMessages: service(),

    banSite: '',
    banReason: '',
    banPlayerReason: '',
  
    resetOnExit: function() {
      this.set('banSite', '');
      this.set('banReason', '');
      this.set('banPlayer', null);
      this.set('banPlayerReason', '');
    },
    
    actions: {
      banPlayerChanged(player) {
        this.set('banPlayer', player);
      },
      
      removeBan(site) {
          
         this.gameApi.requestOne('banRemove', 
             { site: site}, null)
          .then((response) => {            
              if (response.error) {
                  return;
              }            
              this.send('reloadModel');
              this.flashMessages.success("Ban removed.");
          });
      }, 
      
      banSite() {
        if (this.banSite.length == 0 || this.banReason.length == 0) {
          this.flashMessages.danger("You must specify a site and reason.");
          return;
        }
       this.gameApi.requestOne('banAdd', 
           { site: this.banSite, reason: this.banReason }, null)
        .then((response) => {            
            if (response.error) {
                return;
            }            
            this.send('reloadModel');
            this.flashMessages.success("Ban added.");
        });
        
      },
      
      banPlayer() {
        if (!this.banPlayer || this.banPlayerReason.length == 0) {
          this.flashMessages.danger("You must specify a player and reason.");
          return;
        }
       this.gameApi.requestOne('banPlayer', 
           { name: this.get('banPlayer.name'), reason: this.banPlayerReason }, null)
        .then((response) => {            
            if (response.error) {
                return;
            }            
            this.send('reloadModel');
            this.flashMessages.success("Player banned.");
        });
        
      },
    }
});