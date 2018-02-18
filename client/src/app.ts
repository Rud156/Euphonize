import { inject } from 'aurelia-framework';

// @ts-ignore
import * as UIkit from 'uikit';
import 'fontawesome';

import TrackService from './common/services/trackService';
import { CONTENT_TYPES } from './common/utils/constants';

@inject(TrackService)
export class App {
  sidebarRef: HTMLElement;
  sidebarShowing: boolean = false;
  searchString: string = '';
  styleString: string = 'color: white';

  constructor(private trackService: TrackService) {}

  attached() {
    UIkit.offcanvas(this.sidebarRef).hide();

    UIkit.util.on(this.sidebarRef, 'hidden', () => {
      this.closeSidebar();
    });

    this.trackService.getTopTracks(CONTENT_TYPES.USER_CU).then(data => {
      console.log(data);
    });
  }

  detached() {
    // @ts-ignore
    this.sidebarRef.$destroy();
  }

  closeSidebar() {
    this.sidebarShowing = false;
  }

  searchSubmitted() {
    console.log(this.searchString);
    this.searchString = '';
  }

  inputFocused() {
    this.styleString = 'color: #666';
  }

  inputBlurred() {
    this.styleString = 'color: white';
  }

  toggleSidebar() {
    if (this.sidebarShowing) {
      UIkit.offcanvas(this.sidebarRef).hide();
      this.sidebarShowing = false;
    } else {
      UIkit.offcanvas(this.sidebarRef).show();
      this.sidebarShowing = true;
    }
  }
}
