import { LINK_REGEX } from '../../common/utils/constants';

export class RemoveLinkValueConverter {
  toView(htmlString: string) {
    if (!htmlString) return '';
    return htmlString.replace(LINK_REGEX, '');
  }
}
