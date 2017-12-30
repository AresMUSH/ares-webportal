import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('home', { path: ''});
  this.route('login', { path: '/login'});
  this.route('scenes', { path: '/scenes'});
  this.route('scene', { path: '/scene/:id' } );
  this.route('characters', { path: '/chars'});
  this.route('char', { path: '/char/:id' });
  this.route('players', { path: '/players'});
  this.route('player', { path: '/player/:id'});
  this.route('locations', { path: '/locations'});
  this.route('fs3-skills', { path: '/fs3-skills'});
  this.route('fs3-gear', { path: '/fs3-gear'});
  this.route('who', { path: '/who'});
  this.route('wiki', function() {
      this.route('index', { path: '/'});
      this.route('page', { path: '/:id'});
      this.route('all', { path: '/all'});
      this.route('tags', { path: '/tags'});
      this.route('tag', { path: '/tag/:id'});
  });
  this.route('events', { path: '/events'});
  this.route('boards', { path: '/boards'});
  this.route('help', { path: '/help'});
  this.route('admin', { path: '/admin'});
  this.route('play');
  this.route('report-error');
  this.route('register');
  this.route('mail');
  this.route('profile');
});

export default Router;
