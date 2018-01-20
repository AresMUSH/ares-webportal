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
  this.route('error');
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
  this.route('who', { path: '/who'});
  this.route('wiki', function() {
      this.route('index', { path: '/'});
      this.route('page', { path: '/:id'});
      this.route('all', { path: '/all'});
      this.route('tags', { path: '/tags'});
      this.route('tag', { path: '/tag/:id'});
      this.route('edit', { path: '/:id/edit'});
      this.route('create', { path: '/create'});
      this.route('source', { path: '/:page_id/source/:version_id'});
      this.route('compare', { path: '/:page_id/compare/:version_id'});
      this.route('revert', { path: '/:page_id/revert/:version_id'});
  });
  this.route('events', function() {
      this.route('index', { path: '/'} );
      this.route('event', { path: '/:event_id'} );
      this.route('edit', { path: '/:event_id/edit'} );
      this.route('create', { path: '/create' } );
      this.route('ical', { path: '/ical' } );
  });
  this.route('play');
  this.route('register');
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
  this.route('files', function() {
      this.route('index', { path: '/' });
      this.route('file', { path: '/file', queryParams: [ 'path', 'name' ] });
      this.route('edit', { path: '/file/edit', queryParams: [ 'path', 'name' ] });
  });

  this.route('help');
  this.route('help-topic', { path: '/help/:topic' });

  this.route('locations');
  this.route('location', { path: '/location/:id'});

  this.route('combat', { path: '/combat/:id' });
  this.route('combats');

  this.route('map', { path: '/map/:id' });
  this.route('maps');

  this.route('mail');
  this.route('admin', { path: '/admin'});
  this.route('roster');
  this.route('chargen');
  this.route('chargen-review');
});

export default Router;
