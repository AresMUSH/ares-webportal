import EmberObject from '@ember/object';
import TransitionOnErrorMixin from 'ares-webclient/mixins/transition-on-error';
import { module, test } from 'qunit';

module('Unit | Mixin | transition on error');

// Replace this with your real tests.
test('it works', function(assert) {
  let TransitionOnErrorObject = EmberObject.extend(TransitionOnErrorMixin);
  let subject = TransitionOnErrorObject.create();
  assert.ok(subject);
});
