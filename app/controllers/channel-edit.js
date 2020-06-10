import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
  
    actions: {        
        save: function() {
          let api = this.gameApi;
          api.requestOne('saveChannel', { id: this.get('model.channel.id'),
             name: this.get('model.channel.name'), 
             desc: this.get('model.channel.desc'),
             can_talk: (this.get('model.channel.can_talk') || []),
             can_join: (this.get('model.channel.can_join') || []),
             color: this.get('model.channel.color')}, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.transitionToRoute('channels-manage');
              this.flashMessages.success('Channel updated!');
          });
        },
        
        talkRolesChanged: function(roles) {
          this.set('model.channel.can_talk', roles);
        },

        joinRolesChanged: function(roles) {
          this.set('model.channel.can_join', roles);
        }
    }
    
});