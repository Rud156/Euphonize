export class PlayerTimeValueConverter {
  toView(value: number): string {
    const minutesValue = Math.floor(value / 60);
    const secondsValue = Math.floor(value % 60);

    const minutes = minutesValue < 10 ? `0${minutesValue}` : minutesValue.toString();
    const seconds = secondsValue < 10 ? `0${secondsValue}` : secondsValue.toString();
    return `${minutes}:${seconds}`;
  }
}
