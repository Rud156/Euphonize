//@ts-ignore
import * as UIkit from 'uikit';
import 'fontawesome';

export class App {
  message = 'Hello World!';

  attached() {
    UIkit.notification('Hello World');
  }
}
