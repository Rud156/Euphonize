//@ts-ignore
import * as UIkit from 'uikit';
import 'fontawesome';

export class App {
  sidebarRef: HTMLElement;
  sidebarShowing: boolean = false;
  searchString: string = '';

  attached() {
    UIkit.offcanvas(this.sidebarRef).hide();

    UIkit.util.on(this.sidebarRef, 'hidden', () => {
      this.closeSidebar();
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
