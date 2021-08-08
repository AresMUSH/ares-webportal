self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    
    /* Blocked by addons */
    { handler: "silence", matchId: "ember-global" },
    { handler: "silence", matchId: "ember.built-in-components.import" },
    { handler: "silence", matchId: "ember.globals-resolver" },
    { handler: "silence", matchId: "deprecated-run-loop-and-computed-dot-access" },
    { handler: "silence", matchId: "old-deprecate-method-paths" },
    { handler: "silence", matchId: "ember-source.deprecation-without-for" },
    { handler: "silence", matchId: "ember-source.deprecation-without-since" },
    { handler: "silence", matchId: "ember-simple-auth.mixins.application-route-mixin" },
    { handler: "silence", matchId: "implicit-injections" },
    { handler: "silence", matchId: "ember-simple-auth.events.session-service" },
    { handler: "silence", matchId: "manager-capabilities.modifiers-3-13" },

    /* Ares internals */
    { handler: "log", matchId: "computed-property.override" },
    { handler: "log", matchId: "routing.transition-methods" },
    { handler: "log", matchId: "this-property-fallback" },
    { handler: "log", matchId: "ember.built-in-components.legacy-attribute-arguments" },
    
    /* silence, log, throw */
  ]
};