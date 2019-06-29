import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | fs3-xp-costs', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:fs3-xp-costs');
    assert.ok(route);
  });
});
