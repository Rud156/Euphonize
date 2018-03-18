export class TrimStringValueConverter {
  toView(data: string, count: number) {
    if (!data) return '';
    return data.length < count ? data : `${data.slice(0, count)}...`;
  }
}
