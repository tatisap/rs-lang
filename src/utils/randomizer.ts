import { Numbers } from '../types';

export default class Randomizer {
  public getRandomIntegerFromOneToMax(max: number): number {
    return Math.floor(Numbers.One + Math.random() * max);
  }

  public getRandomItemsFromArray<T>(array: T[], numberOfItems: number): T[] {
    const shuffledArray: T[] = this.shuffle<T>(array);
    shuffledArray.length = numberOfItems;
    return shuffledArray;
  }

  public shuffle<T>(items: T[]): T[] {
    const shuffledItems: T[] = items;
    for (
      let index: number = items.length - Numbers.One;
      index > Numbers.Zero;
      index -= Numbers.One
    ) {
      const newIndex: number = Math.floor(Math.random() * (index + Numbers.One));
      [shuffledItems[index], shuffledItems[newIndex]] = [
        shuffledItems[newIndex],
        shuffledItems[index],
      ];
    }
    return shuffledItems;
  }
}
