import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('home', { path: '/'});
  this.route('play');
  this.route('login');
  this.route('logout');
  this.route('scenes');
  this.route('characters');
  this.route('players');
  this.route('locations');
  this.route('fs3-skills');
  this.route('fs3-gear');
  this.route('who');
  this.route('wiki');
  this.route('events');
  this.route('boards');
  this.route('help');
  this.route('admin');
  this.route('scene', { path: '/scene/:id' } );
});

export default Router;
