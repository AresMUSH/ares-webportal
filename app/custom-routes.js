export default function setupCustomRoutes(router) {
  // Define your own custom routes here, just as you would in router.js but using 'router' instead of 'router'.
  // For example:
  // router.route('yourroute');

  router.route('creature', { path: '/creature/:id' });
  router.route('creatures', { path: '/creatures' });
  router.route('creature-create', { path: '/creature/create' });
  router.route('creature-edit', { path: '/creature/:id/edit' });
  router.route('portal', { path: '/portal/:id' });
  router.route('portals', { path: '/portals' });
  router.route('portal-create', { path: '/portal/create' });
  router.route('portal-edit', { path: '/portal/:id/edit' });
  router.route('lore-hooks');
  router.route('search-spells');
  router.route('secrets');
  router.route('schools', { path: '/schools/:school'});
  router.route('spells', { path: '/spells'});
  router.route('spells-export', { path: '/spells-export/:school'});
  router.route('spell-fatigue'), { path: '/spell-fatigue'};

}
