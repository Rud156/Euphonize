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
        title: 'Artists',
      },
      {
        route: '/:name',
        name: 'artistDetail',
        moduleId: '../artist-detail/index',
        nav: false,
      },
      {
        route: '/:name/album/:album',
        name: 'albumDetail',
        moduleId: '../album-detail/index',
        nav: false,
      },
      {
        route: '/:name/track/:track',
        name: 'trackDetail',
        moduleId: '../track-detail/index',
        nav: false,
      },
    ]);
  }
}
