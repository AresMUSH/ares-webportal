import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
    
    didTransition() {
      this._super(...arguments);
      window.scrollTo(0, 0);
    }
});

Router.map(function() {
  this.route('home', { path: ''});
  this.route('login', { path: '/login'});
  this.route('scenes', function() {
      this.route('index', { path: '/' });
      this.route('scene', { path: '/:id' } );    
      this.route('edit', { path: '/:id/edit' } );    
      this.route('create');
  });
  this.route('plots', function() {
      this.route('index', { path: '/' });
      this.route('plot', { path: '/:id' });
      this.route('edit', { path: '/:id/edit' });
      this.route('create');
  });
  
  this.route('fs3combat', function() {
      this.route('gear');
      this.route('gear-detail', { path: '/:type/:name' })
  });
  
  this.route('fs3skills', function() {
      this.route('abilities');
  });
  
  this.route('characters', { path: '/chars'});
  this.route('char', { path: '/char/:id' });
  this.route('players', { path: '/players'});
  this.route('player', { path: '/player/:id'});
  this.route('locations', { path: '/locations'});
  this.route('who', { path: '/who'});
  this.route('wiki', function() {
      this.route('index', { path: '/'});
      this.route('page', { path: '/:id'});
      this.route('all', { path: '/all'});
      this.route('tags', { path: '/tags'});
      this.route('tag', { path: '/tag/:id'});
  });
  this.route('events', function() {
      this.route('index', { path: '/'} );
      this.route('event', { path: '/:event_id'} );
      this.route('edit', { path: '/:event_id/edit'} );
      this.route('create', { path: '/create' } );
      this.route('ical', { path: '/ical' } );
  });
  this.route('boards', { path: '/boards'});
  this.route('help', { path: '/help'});
  this.route('admin', { path: '/admin'});
  this.route('play');
  this.route('report-error');
  this.route('register');
  this.route('mail');
  this.route('profile');
  this.route('forum', function() {
      this.route('index', { path: '/' });
      this.route('category', { path: '/:category_id'});
      this.route('topic', { path: '/:category_id/:topic_id'});
      this.route('new-post', { path: '/:category_id/new-post' })
  });
  this.route('census', function() {
      this.route('index', { path: '/' });
      this.route('group', { path: '/:filter'} )
  });
  this.route('actors');
});

export default Router;
