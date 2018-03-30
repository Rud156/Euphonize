import { customAttribute, inject } from 'aurelia-framework';
import { TRACK_IMAGE_PLACEHOLDER } from '../../common/utils/constants';

@inject(HTMLImageElement)
export class SourceCustomAttribute {
  value: any;
  imageSource: string = '';
  eventListenerRemoved: boolean = false;

  constructor(private element: HTMLImageElement) {}

  bind() {
    this.imageSource = this.value;
    this.element.src = this.imageSource;
  }

  handleImageError() {
    this.element.removeEventListener('error', this.handleImageError);
    this.element.src = TRACK_IMAGE_PLACEHOLDER;
    this.eventListenerRemoved = true;
  }

  attached() {
    this.element.addEventListener('error', this.handleImageError.bind(this));
  }

  detached() {
    if (!this.eventListenerRemoved)
      this.element.removeEventListener('error', this.handleImageError);
  }
}
