import RSVP from 'rsvp';
import Ember from 'ember';
import { inject as service } from '@ember/service';

export function initialize(appInstance) {
  gameApi: service(),
  
  Ember.onerror = function(error) {
    this.gameApi.reportError(error);
  };

  RSVP.on('error', function(error) {
    this.gameApi.reportError(error);
  });  
}

export default {
  initialize
};
