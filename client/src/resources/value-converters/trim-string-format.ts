export class TrimStringValueConverter {
  toView(data: string, count: number) {
    return data.length < count ? data : `${data.slice(0, count)}...`;
  }
}
