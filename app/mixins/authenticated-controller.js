import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Mixin.create({
  session: service(),

  isAuthenticated: computed.reads('session.isAuthenticated'),

  isApproved: computed.reads('session.data.authenticated.is_approved'),

  isAdmin: computed.reads('session.data.authenticated.is_admin'),

  isCoder: computed.reads('session.data.authenticated.is_coder'),

  isWikiMgr: computed.reads('session.data.authenticated.is_wiki_mgr'),

  currentUser: computed.reads('session.data.authenticated'),
});
