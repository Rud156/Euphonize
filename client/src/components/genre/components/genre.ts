import { inject } from 'aurelia-framework';

// @ts-ignore
import * as UIkit from 'uikit';

import GenreService from '../../../common/services/genreService';

@inject(GenreService)
export class Genre {
  genreGrid: HTMLElement;

  genreLoading: boolean = false;
  genres: string[];

  constructor(private genreService: GenreService) {}

  fetchGenreData() {
    this.genreLoading = true;

    this.genreService.getTopGenres().then((data: { success: boolean; popular_genre: string[] }) => {
      if (data.success) {
        this.genres = data['popular_genre'];
      }

      this.genreLoading = false;
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
