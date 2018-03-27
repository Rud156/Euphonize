export class TrimStringValueConverter {
  toView(data: string, count: number) {
    if (!data) return '';
    return data.length < count ? data : `${data.toString().slice(0, count)}...`;
  }
}
