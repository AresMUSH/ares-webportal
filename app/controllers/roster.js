import { set } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
    gameApi: service(),
    confirmClaim: null,

    resetOnExit: function() {
      this.set('confirmClaim', null);
    },
    
    actions: {
        claimRoster() {
            let api = this.gameApi;
            let claim = this.confirmClaim;
            this.set('confirmClaim', null);
            api.requestOne('claimRoster', { id: claim.id })
            .then( (response) => {
                if (response.error) {
                    return;
                }
                set(claim, 'password', response.password);
            });
        }
    }
});