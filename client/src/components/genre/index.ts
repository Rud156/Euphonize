import { inject } from 'aurelia-framework';
import { RouterConfiguration, Router } from 'aurelia-router';

export class Genre {
  router: Router;

  constructor() {}

  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router;
    config.map([
      {
        route: '',
        moduleId: './genre',
        title: 'Genre',
      },
      {
        route: '/:name',
        moduleId: './../genre-details/index',
      },
    ]);
  }
}
