import { inject } from 'aurelia-framework';

// @ts-ignore
import * as UIkit from 'uikit';

import Store from '../../common/utils/store';

@inject(Store)
export class MyLibrary {
  constructor(private store: Store) {
    console.log('My Library');
  }
}
