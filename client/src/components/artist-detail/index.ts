import { inject } from 'aurelia-framework';
import { RouterConfiguration, Router, RouteConfig } from 'aurelia-router';

interface IParams {
  name: string;
}

export class ArtistsDetailIndex {
  router: Router;

  constructor() {}

  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router;
    config.map([
      {
        route: '',
        moduleId: './components/artist-detail',
        title: '',
      },
      {
        route: '/album/:album',
        name: 'albumDetail',
        moduleId: '../album-detail/index',
        nav: false,
      },
      {
        route: '/track/:track',
        name: 'trackDetail',
        moduleId: '../track-detail/index',
        nav: false,
      },
    ]);
  }

  activate(params: IParams, routeConfig: RouteConfig) {
    routeConfig.navModel.setTitle(params.name);
  }
}
