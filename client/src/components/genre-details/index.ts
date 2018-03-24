import { RouteConfig } from 'aurelia-router';

interface IParams {
  name: string;
}

export class GenreDetails {
  genreName: string = '';

  constructor() {}

  activate(params: IParams, routeConfig: RouteConfig) {
    routeConfig.navModel.setTitle(params.name);
    this.genreName = params.name;
  }
}
