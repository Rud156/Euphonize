export class DateTimeValueConverter {
  toView(value: string): string {
    if (!value) {
      return value;
    }

    const date = new Date(value);
    return date.toDateString();
  }
}
