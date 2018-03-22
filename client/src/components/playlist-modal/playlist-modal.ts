import { bindable } from 'aurelia-framework';

import { ISelectablePlaylist } from '../../common/interfaces/playlist-interface';

export class PlaylistModal {
  @bindable playlists: ISelectablePlaylist[];
  @bindable track;
  @bindable checkboxSelect: Function;
  @bindable saveData;

  handleCheckboxSelect(index: number) {
    const { selected } = this.playlists[index];
    this.checkboxSelect({
      index: index,
      state: !selected,
    });
  }
}
