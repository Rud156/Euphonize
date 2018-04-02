import { inject } from 'aurelia-framework';
import AlbumService from '../../common/services/albumService';
import { EventAggregator } from 'aurelia-event-aggregator';

// @ts-ignore
import * as UIkit from 'uikit';

import { IAlbumData, ITopAlbumResponse } from '../../common/interfaces/album-interface';

@inject(AlbumService, EventAggregator)
export class Albums {
  topAlbumsGrid: HTMLElement;

  albums: IAlbumData[] = [];
  albumsLoading: boolean = false;

  constructor(private albumService: AlbumService, private ea: EventAggregator) {}

  fetchTopAlbums() {
    this.albumsLoading = true;

    this.albumService.getTopAlbums().then((data: ITopAlbumResponse) => {
      if (data.success) {
        this.albums = data.albums;
      }

      this.albumsLoading = false;
    });
  }

  attached() {
    this.fetchTopAlbums();
    this.initializeElements();
  }

  initializeElements() {
    UIkit.grid(this.topAlbumsGrid);
  }
}
