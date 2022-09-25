import Mixin from '@ember/object/mixin';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Mixin.create({
  session: service(),

  isAuthenticated: reads('session.isAuthenticated'),

  isApproved: reads('session.data.authenticated.is_approved'),

  isAdmin: reads('session.data.authenticated.is_admin'),

  isCoder: reads('session.data.authenticated.is_coder'),

  isThemeMgr: reads('session.data.authenticated.is_theme_mgr'),

  currentUser: reads('session.data.authenticated'),
});
