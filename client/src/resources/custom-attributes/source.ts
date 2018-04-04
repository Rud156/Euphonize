import { customAttribute, inject } from 'aurelia-framework';
import { TRACK_IMAGE_PLACEHOLDER } from '../../common/utils/constants';

@inject(Element)
export class SourceCustomAttribute {
  value: any;
  imageSource: string = '';
  eventListenerRemoved: boolean = false;

  constructor(private element: Element) {}

  bind() {
    this.imageSource = this.value;
    // @ts-ignore
    this.element.src = this.imageSource;
  }

  valueChanged() {
    this.imageSource = this.value;
    // @ts-ignore
    this.element.src = this.imageSource;

    if (this.eventListenerRemoved) {
      this.eventListenerRemoved = false;
      this.element.addEventListener('error', this.handleImageError.bind(this));
    }
  }

  handleImageError() {
    this.element.removeEventListener('error', this.handleImageError);
    // @ts-ignore
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
