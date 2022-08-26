export default function setupCustomRoutes(router) {
  // Define your own custom routes here, just as you would in router.js but using 'router' instead of 'this'.
  // For example:
  // router.route('yourroute');
  
  router.route('creature', { path: '/cryptid/:id' });
  router.route('creatures', { path: '/cryptids' });
  router.route('creature-create', { path: '/cryptid/create' });
  router.route('creature-edit', { path: '/cryptid/:id/edit' });
  router.route('lore-hooks');
  router.route('search-spells');
  router.route('school', { path: '/school/:school'});
  router.route('spells', { path: '/spells'});
  router.route('spell-fatigue'), { path: '/spell-fatigue'};
}
