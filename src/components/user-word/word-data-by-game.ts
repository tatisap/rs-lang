import { GAMES } from '../../constants';
import { GameName, IAnswerCounter, IUserWordDataByGame, Numbers } from '../../types';

export default class WordDataByGame {
  private dateKey: string;

  private dataByGames: {
    game: GameName;
    counter: IAnswerCounter;
  }[];

  constructor(dateKey: string) {
    this.dateKey = dateKey;
    this.dataByGames = (Object.keys(GAMES) as GameName[]).map(
      (gameName: GameName): { game: GameName; counter: IAnswerCounter } => {
        return {
          game: gameName,
          counter: { correctAnswersCounter: Numbers.Zero, incorrectAnswersCounter: Numbers.Zero },
        };
      }
    );
  }

  public getDateKey(): string {
    return this.dateKey;
  }

  public increaseCorrectAnswer(game: GameName): void {
    (
      this.dataByGames.find(
        (data: { game: GameName; counter: IAnswerCounter }): boolean => game === data.game
      ) as { game: GameName; counter: IAnswerCounter }
    ).counter.correctAnswersCounter += Numbers.One;
  }

  public increaseIncorrectAnswer(game: GameName): void {
    (
      this.dataByGames.find(
        (data: { game: GameName; counter: IAnswerCounter }): boolean => game === data.game
      ) as { game: GameName; counter: IAnswerCounter }
    ).counter.incorrectAnswersCounter += Numbers.One;
  }

  public update(data: IUserWordDataByGame): WordDataByGame {
    (Object.keys(data) as GameName[]).forEach((gameName: GameName): void => {
      Object.assign(
        (
          this.dataByGames.find(
            (gameData: { game: GameName; counter: IAnswerCounter }): boolean =>
              gameName === gameData.game
          ) as { game: GameName; counter: IAnswerCounter }
        ).counter,
        data[gameName]
      );
    });
    return this;
  }

  public getInfo(): { dateKey: string; data: IUserWordDataByGame } {
    const cloneDataByGames: [GameName, IAnswerCounter][] = this.dataByGames.map(
      (gameData: { game: GameName; counter: IAnswerCounter }): [GameName, IAnswerCounter] => [
        gameData.game,
        { ...gameData.counter },
      ]
    );
    return {
      dateKey: this.dateKey,
      data: Object.fromEntries(cloneDataByGames) as IUserWordDataByGame,
    };
  }
}
