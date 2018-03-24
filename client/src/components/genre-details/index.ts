import { RouteConfig } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import TrackService from '../../common/services/trackService';
import AlbumService from '../../common/services/albumService';
import { EventAggregator } from 'aurelia-event-aggregator';

interface IParams {
  name: string;
}

@inject(TrackService, AlbumService, EventAggregator)
export class GenreDetails {
  genreName: string = '';

  constructor(
    private trackService: TrackService,
    private albumService: AlbumService,
    private ea: EventAggregator
  ) {}

  fetchTrackData() {
    this.trackService.getTracksForGenre(this.genreName).then(data => {
      console.log(data);
    });
  }

  fetchAlbumData() {
    this.albumService.getAlbumsForGenre(this.genreName).then(data => {
      console.log(data);
    });
  }

  activate(params: IParams, routeConfig: RouteConfig) {
    routeConfig.navModel.setTitle(params.name);
    this.genreName = params.name;

    if (this.genreName) {
      this.fetchTrackData();
      this.fetchAlbumData();
    }
  }

  publishNotification(eventType: string, message: string, error: object) {
    this.ea.publish('notification', {
      type: eventType,
      message,
      data: error,
    });
  }
}
