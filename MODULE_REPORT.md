## Module Report
### Unknown Global

**Global**: `Ember.onerror`

**Location**: `app/instance-initializers/error-handler.js` at line 8

```js
  let service = appInstance.lookup('service:gameApi');

  Ember.onerror = function(error) {
    service.reportError(error);
  };
```
