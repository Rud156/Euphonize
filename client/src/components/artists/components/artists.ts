import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

// @ts-ignore
import * as UIkit from 'uikit';

import ArtistService from '../../../common/services/artistService';
import { CONTENT_TYPES } from '../../../common/utils/constants';

@inject(ArtistService, Router)
export class Artists {
  topArtistsGrid: HTMLElement;

  topArtists = [];
  topArtistsLoading: boolean = false;
  emergingArtists = [];
  emergingArtistsLoading: boolean = false;

  constructor(private artistService: ArtistService, private router: Router) {}

  fetchTopArtists() {
    this.topArtistsLoading = true;

    this.artistService.getTopArtists(CONTENT_TYPES.USER_CU).then(data => {
      if (data.success) {
        this.topArtists = data.artists;
      }
      this.topArtistsLoading = false;
    });
  }

  fetchEmergingArtists() {
    this.emergingArtistsLoading = true;

    this.artistService.getEmergingArtists().then(data => {
      if (data.success) {
        this.emergingArtists = data.artists;
      }
      this.emergingArtistsLoading = false;
    });
  }

  attached() {
    this.fetchTopArtists();
    // this.fetchEmergingArtists();
    this.initializeElements();
  }

  initializeElements() {
    UIkit.grid(this.topArtistsGrid);
  }
}
