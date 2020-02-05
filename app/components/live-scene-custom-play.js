import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  diceReason: null,
  tagName: '',
  diceString: '',
  
  gameApi: service(),
  flashMessages: service(),

  actions: {

    rollDice() {
      let api = this.gameApi;
	  let diceReason = this.diceReason;
      let dice = this.diceString;
      this.set('showRollDice', null);
      this.set('diceString', '');
          
      if (!dice) {
        this.flashMessages.danger("You haven't specified what dice to roll.");
        return;
      }

      api.requestOne('rollDice', { id: this.get('scene.id'), dice_string: dice }, null)
      .then( (response) => {
        if (response.error) {
          return;
        }
      });
    }
  }
});