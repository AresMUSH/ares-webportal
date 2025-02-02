import RSVP from 'rsvp';
import Ember from 'ember';
import { service } from '@ember/service';


export function initialize(appInstance) {
  
  Ember.onerror = function(error) {
    let gameApi = appInstance.lookup('service:game-api');
    gameApi.reportError(error);
  };

  RSVP.on('error', function(error) {
    let gameApi = appInstance.lookup('service:game-api');
    gameApi.reportError(error);
  });  
}

export default {
  initialize
};
