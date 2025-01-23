import RSVP from 'rsvp';
import Ember from 'ember';
import { inject as service } from '@ember/service';

export function initialize(appInstance) {
  const gameApi = service();  
  
  Ember.onerror = function(error) {
    gameApi.reportError(error);
  };

  RSVP.on('error', function(error) {
    gameApi.reportError(error);
  });  
}

export default {
  initialize
};
