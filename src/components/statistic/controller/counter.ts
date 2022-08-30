import { GameName, IUserWord, Numbers } from '../../../types';

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

  public countNewWordsForDate(userWords: IUserWord[], gameNames: GameName[], dateKey: string) {
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
        userWord.optional.dataByDates[dateKey]?.[gameName]?.correctAnswersCounter;
      if (numberOfCorrectAnswers) return counter + numberOfCorrectAnswers;
      return counter;
    }, Numbers.Zero);
  }

  public countCorrectAnswersForDate(
    userWords: IUserWord[],
    gameNames: GameName[],
    dateKey: string
  ) {
    return gameNames
      .map((gameName: GameName): number =>
        this.countCorrectAnswersInGameForDate(userWords, gameName, dateKey)
      )
      .reduce(
        (counter: number, correctAnswersInGame: number): number => counter + correctAnswersInGame
      );
  }

  public countLearnedWordsForDate(userWords: IUserWord[], dateKey: string): number {
    return userWords.reduce((counter: number, userWord: IUserWord): number => {
      if (userWord.optional.dateOfLearning === dateKey) return counter + Numbers.One;
      return counter;
    }, Numbers.Zero);
  }
}
