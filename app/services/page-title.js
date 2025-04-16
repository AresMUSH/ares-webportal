import EmberPageTitleService from 'ember-page-title/services/page-title';
import { inject as service } from '@ember/service';

export default class PageTitleService extends EmberPageTitleService {
  @service headData;

  titleDidUpdate(title) {
    this.set('headData.title', title);
  }
}