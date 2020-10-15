import Application from 'ares-webportal/app';
import config from 'ares-webportal/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
