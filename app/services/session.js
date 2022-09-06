import BaseSessionService from 'ember-simple-auth/services/session';

export default class AresSessionService extends BaseSessionService {
  async handleAuthentication() {
    // Override base functionality because we don't want their redirect
    //super.handleAuthentication(...arguments);
  }
}