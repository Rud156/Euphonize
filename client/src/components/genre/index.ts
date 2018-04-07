import { inject } from 'aurelia-framework';
import { RouterConfiguration, Router } from 'aurelia-router';

export class GenreIndex {
  router: Router;

  constructor() {}

  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router;
    config.map([
      {
        route: '',
        moduleId: './components/genre',
        title: 'Genre',
      },
      {
        route: '/:name',
        moduleId: './../genre-details/index',
      },
    ]);
  }
}
