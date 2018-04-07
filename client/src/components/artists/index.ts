import { inject } from 'aurelia-framework';
import { RouterConfiguration, Router } from 'aurelia-router';

export class ArtistsIndex {
  router: Router;

  constructor() {}

  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router;
    config.map([
      {
        route: '',
        moduleId: './components/artists',
        title: '',
      },
      {
        route: '/:name',
        name: 'artistDetail',
        moduleId: '../artist-detail/index',
        nav: false,
      },
    ]);
  }
}
