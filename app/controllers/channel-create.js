import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    name: '',
    desc: '',
    color: '',
    can_talk: null,
    can_join: null,
  
    actions: {        
        save: function() {
          let api = this.gameApi;
          api.requestOne('createChannel', { id: this.get('id'),
             name: this.get('name'), 
             desc: this.get('desc'),
             can_talk: (this.get('can_talk') || []),
             can_join: (this.get('can_join') || []),
             color: this.get('color')}, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
              this.transitionToRoute('channels-manage');
              this.flashMessages.success('Channel created!');
          });
        },
        
        talkRolesChanged: function(roles) {
          this.set('can_talk', roles);
        },

        joinRolesChanged: function(roles) {
          this.set('can_join', roles);
        }
    }
    
});