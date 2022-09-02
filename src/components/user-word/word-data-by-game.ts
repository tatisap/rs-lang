import { GAMES } from '../../constants';
import { GameName, IAnswerCounter, IUserWordDataByGame, Numbers } from '../../types';

export default class WordDataByGame {
  private dateKey: string;

  private dataByGames: [GameName, IAnswerCounter][];

  constructor(dateKey: string) {
    this.dateKey = dateKey;
    this.dataByGames = (Object.keys(GAMES) as GameName[]).map(
      (gameName: GameName): [GameName, IAnswerCounter] => [
        gameName,
        { correctAnswersCounter: Numbers.Zero, incorrectAnswersCounter: Numbers.Zero },
      ]
    );
  }

  public getDateKey(): string {
    return this.dateKey;
  }

  public increaseCorrectAnswer(game: GameName): void {
    (
      this.dataByGames.find(
        (data: [GameName, IAnswerCounter]): boolean => game === data[Numbers.Zero]
      ) as [GameName, IAnswerCounter]
    )[Numbers.One].correctAnswersCounter += Numbers.One;
  }

  public increaseIncorrectAnswer(game: GameName): void {
    (
      this.dataByGames.find(
        (data: [GameName, IAnswerCounter]): boolean => game === data[Numbers.Zero]
      ) as [GameName, IAnswerCounter]
    )[Numbers.One].incorrectAnswersCounter += Numbers.One;
  }

  public update(data: IUserWordDataByGame): WordDataByGame {
    (Object.keys(data) as GameName[]).forEach((gameName: GameName): void => {
      Object.assign(
        (
          this.dataByGames.find(
            (gameData: [GameName, IAnswerCounter]): boolean => gameName === gameData[Numbers.Zero]
          ) as [GameName, IAnswerCounter]
        )[Numbers.One],
        data[gameName]
      );
    });
    return this;
  }

  public getInfo(): [string, IUserWordDataByGame] {
    const cloneDataByGames: [GameName, IAnswerCounter][] = this.dataByGames.map(
      (gameData: [GameName, IAnswerCounter]): [GameName, IAnswerCounter] => [
        gameData[Numbers.Zero],
        { ...gameData[Numbers.One] },
      ]
    );
    return [this.dateKey, Object.fromEntries(cloneDataByGames) as IUserWordDataByGame];
  }
}
