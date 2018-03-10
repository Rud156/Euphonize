export class TrimStringValueConverter {
  toView(data: string, count: number) {
    if (data.length < count) return data;
    else return `${data.slice(0, count)}...`;
  }
}
