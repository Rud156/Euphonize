import "./../assets/UIKit/css/uikit.min.css";
import * as UIkit from "./../assets/UIKit/js/uikit";

import "./../assets/font-awesome/js/fontawesome-all";

export class App {
  message = "Hello World!";

  attached() {
    UIkit.notification("Hello World");
  }
}
