import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';

// @ts-ignore
import * as UIkit from 'uikit';

import ArtistService from '../../common/services/artistService';
import { CONTENT_TYPES } from '../../common/utils/constants';

@inject(EventAggregator, ArtistService)
export class Artists {
  topArtistsGrid: HTMLElement;

  topArtists = [];
  topArtistsLoading: boolean = false;
  emergingArtists = [];
  emergingArtistsLoading: boolean = false;

  constructor(private ea: EventAggregator, private artistService: ArtistService) {}

  handleArtistClick(artistName: string, image: string) {
    console.log(artistName);
    console.log(image);
  }

  fetchTopArtists() {
    this.topArtistsLoading = true;

    this.artistService
      .getTopArtists(CONTENT_TYPES.USER_CU)
      .then(data => {
        if (data.success) {
          this.topArtists = data.artists;
        }
        this.topArtistsLoading = false;
      })
      .catch(error => {
        this.topArtistsLoading = false;
        this.publishNotification(
          'error',
          'Yikes! Yikes! We were unable to load the data. Could you try again',
          error
        );
      });
  }

  fetchEmergingArtists() {
    this.emergingArtistsLoading = true;

    this.artistService
      .getEmergingArtists()
      .then(data => {
        if (data.success) {
          this.emergingArtists = data.artists;
        }
        this.emergingArtistsLoading = false;
      })
      .catch(error => {
        this.publishNotification(
          'error',
          'Yikes! Yikes! We were unable to load the data. Could you try again',
          error
        );
        this.emergingArtistsLoading = false;
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
    this.fetchTopArtists();
    // this.fetchEmergingArtists();
    this.initializeElements();
  }

  detached() {}

  initializeElements() {
    UIkit.grid(this.topArtistsGrid);
  }
}
