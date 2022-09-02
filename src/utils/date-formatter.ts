import { DATE_KEY_SEPARATOR } from '../constants';

export default class DateFormatter {
  public getStringifiedDateKey(date: Date): string {
    return `${date.getFullYear()}${DATE_KEY_SEPARATOR}${date.getMonth()}${DATE_KEY_SEPARATOR}${date.getDate()}`;
  }

  public getDateByDateKey(dateKey: string): Date {
    const dateComponents: [number, number, number] = dateKey
      .split(DATE_KEY_SEPARATOR)
      .map((stringifiedDateComponent: string): number => Number(stringifiedDateComponent)) as [
      number,
      number,
      number
    ];
    return new Date(...dateComponents);
  }
}
