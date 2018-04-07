import { inject } from 'aurelia-framework';
import { RouterConfiguration, Router } from 'aurelia-router';

export class LibraryIndex {
  router: Router;

  constructor() {}

  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router;
    config.map([
      {
        route: '',
        moduleId: './components/library',
        title: 'Genre',
      },
      {
        route: '/:id',
        moduleId: './../library-detail/index',
      },
    ]);
  }
}
