import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

// @ts-ignore
import * as UIkit from 'uikit';

import GenreService from '../../common/services/genreService';

@inject(GenreService, EventAggregator)
export class Genre {
  genreGrid: HTMLElement;

  genreLoading: boolean = false;
  genres: string[];

  constructor(private genreService: GenreService, private ea: EventAggregator) {}

  fetchGenreData() {
    this.genreLoading = true;

    this.genreService
      .getTopGenres()
      .then((data: { success: boolean; popular_genre: string[] }) => {
        if (data.success) {
          this.genres = data['popular_genre'];
        }

        this.genreLoading = false;
      })
      .catch(error => {
        this.publishNotification('error', 'Yikes!! We were unable to load the data.', error);
        this.genreLoading = false;
      });
  }

  publishNotification(eventType: string, message: string, error: object) {
    this.ea.publish('notification', {
      type: eventType,
      message,
      data: error,
    });
  }

  attached() {
    this.fetchGenreData();
    this.initializeElements();
  }

  initializeElements() {
    UIkit.grid(this.genreGrid);
  }
}
