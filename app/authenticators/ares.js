import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';
import Promise from 'rsvp';

export default Base.extend({
    ajax: service(),

    restore(data) {
        this.set('data', data);
        return Promise.resolve(data);
    },
    authenticate(options) {
        let aj = this.get('ajax');
        return aj.queryOne('login', { name: options.name, password: options.password })
        .then((response) => {
            if (response.id) {
                this.set('data', response);
                return Promise.resolve(response);
            }
            return Promise.reject(response);            
        });
    },
    invalidate() {
        return Promise.resolve();
    }
});