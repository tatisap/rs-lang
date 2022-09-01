import { GameName, IDailyChartDataByGame, IUserWord, Numbers } from '../../../types';

export default class StatisticCounter {
  public countNewWordsInGameForDate(
    userWords: IUserWord[],
    gameName: GameName,
    dateKey: string
  ): number {
    return userWords.reduce((counter: number, userWord: IUserWord): number => {
      if (
        userWord.optional.gameNameOfFirstUse === gameName &&
        userWord.optional.dateOfFirstUse === dateKey
      )
        return counter + Numbers.One;
      return counter;
    }, Numbers.Zero);
  }

  public countNewWordsForDate(
    userWords: IUserWord[],
    gameNames: GameName[],
    dateKey: string
  ): number {
    return gameNames
      .map((gameName: GameName): number =>
        this.countNewWordsInGameForDate(userWords, gameName, dateKey)
      )
      .reduce((counter: number, newWordsInGame: number): number => counter + newWordsInGame);
  }

  public countCorrectAnswersInGameForDate(
    userWords: IUserWord[],
    gameName: GameName,
    dateKey: string
  ): number {
    return userWords.reduce((counter: number, userWord: IUserWord): number => {
      const numberOfCorrectAnswers: number =
        userWord.optional.dataByDates[dateKey]?.[gameName]?.correctAnswersCounter || Numbers.Zero;
      return counter + numberOfCorrectAnswers;
    }, Numbers.Zero);
  }

  public countAnswersInGameForDate(
    userWords: IUserWord[],
    gameName: GameName,
    dateKey: string
  ): number {
    return userWords.reduce((counter: number, userWord: IUserWord): number => {
      const numberOfCorrectAnswers: number =
        userWord.optional.dataByDates[dateKey]?.[gameName]?.correctAnswersCounter || Numbers.Zero;
      const numberOfIncorrectAnswers: number =
        userWord.optional.dataByDates[dateKey]?.[gameName]?.incorrectAnswersCounter || Numbers.Zero;
      return counter + numberOfCorrectAnswers + numberOfIncorrectAnswers;
    }, Numbers.Zero);
  }

  public countLearnedWordsForDate(userWords: IUserWord[], dateKey: string): number {
    return userWords.reduce((counter: number, userWord: IUserWord): number => {
      if (userWord.optional.dateOfLearning === dateKey) return counter + Numbers.One;
      return counter;
    }, Numbers.Zero);
  }

  public sumPropertyValues(
    data: IDailyChartDataByGame[],
    property: keyof IDailyChartDataByGame['data']
  ): number {
    return data.reduce(
      (counter: number, dataItem: IDailyChartDataByGame): number =>
        counter + dataItem.data[property],
      Numbers.Zero
    );
  }
}
