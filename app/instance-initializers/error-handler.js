import Ember from 'ember';

const { RSVP, set } = Ember;

export function initialize(appInstance) {
  let service = appInstance.lookup('service:gameApi');

  Ember.onerror = function(error) {
    service.reportError(error);
  };

  RSVP.on('error', function(error) {
    service.reportError(error);
  });
}

export default {
  name: 'error-handler',
  initialize
};