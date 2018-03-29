import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { ISelectablePlaylist } from '../../common/interfaces/playlist-interface';

@inject(EventAggregator)
export class PlaylistModal {
  @bindable playlists: ISelectablePlaylist[];
  @bindable checkboxSelect: Function;
  @bindable saveData;
  @bindable addNewPlaylist: Function;
  @bindable loading: boolean = false;

  showPlaylistInput: boolean = false;
  playlistName: string = '';

  constructor(private ea: EventAggregator) {}

  handleCheckboxSelect(index: number) {
    const { selected } = this.playlists[index];
    this.checkboxSelect({
      index: index,
      state: !selected,
    });
  }

  handleAddNewPlaylist() {
    this.addNewPlaylist({
      name: this.playlistName,
    });
    this.playlistName = '';
    this.closePlaylistInput();
  }

  displayPlaylistInput() {
    this.showPlaylistInput = true;
  }

  closePlaylistInput() {
    this.showPlaylistInput = false;
  }

  inputFocused() {
    this.ea.publish('disablePreventDefault');
  }

  inputBlurred() {
    this.ea.publish('enablePreventDefault');
  }
}
