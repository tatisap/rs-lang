import { GAMES, NO_DATA, NUMBER_OF_CORRECT_ANSWERS_TO_LEARN } from '../../constants';
import {
  GameName,
  IAnswerCounter,
  IUserWord,
  IUserWordDataByGame,
  IUserWordGameDataByDate,
  NoData,
  Numbers,
} from '../../types';
import WordDataByGame from './word-data-by-game';

export default class UserWord {
  private difficulty: 'easy' | 'hard';

  private dateOfMarkAsHard: number | NoData;

  private isLearned: boolean;

  private dateOfLearning: string | NoData;

  private correctAnswersInRow: number;

  private gameOfFirstUse: GameName | NoData;

  private dateOfFirstUse: string | NoData;

  private dataByDates: WordDataByGame[];

  constructor() {
    this.difficulty = 'easy';
    this.dateOfMarkAsHard = NO_DATA;
    this.isLearned = false;
    this.dateOfLearning = NO_DATA;
    this.correctAnswersInRow = Numbers.Zero;
    this.gameOfFirstUse = NO_DATA;
    this.dateOfFirstUse = NO_DATA;
    this.dataByDates = [];
  }

  public markAsEasy(): void {
    this.difficulty = 'easy';
    this.dateOfMarkAsHard = NO_DATA;
  }

  public markAsHard(timestamp: number): void {
    this.difficulty = 'hard';
    this.dateOfMarkAsHard = timestamp;
  }

  public markAsLearned(date: string): void {
    this.isLearned = true;
    this.dateOfLearning = date;
  }

  public remoreLearnedMark(): void {
    this.isLearned = false;
    this.dateOfLearning = NO_DATA;
  }

  public getLearningStatus(): boolean {
    return this.isLearned;
  }

  public wasUsed(): boolean {
    return this.dateOfFirstUse !== NO_DATA;
  }

  public setFirstUseInfo(gameName: GameName, date: string): void {
    this.gameOfFirstUse = gameName;
    this.dateOfFirstUse = date;
  }

  public increaseCorrectAnswersInRow(): void {
    this.correctAnswersInRow += Numbers.One;
  }

  public resetCorrectAnswersInRow(): void {
    this.correctAnswersInRow = Numbers.Zero;
  }

  public checkCorrectAnswersInRow(): boolean {
    return (
      (this.correctAnswersInRow >= NUMBER_OF_CORRECT_ANSWERS_TO_LEARN.forEasyWords &&
        this.difficulty === 'easy') ||
      this.correctAnswersInRow >= NUMBER_OF_CORRECT_ANSWERS_TO_LEARN.forHardWords
    );
  }

  public increaseCorrectAnswers(gameName: GameName, dateKey: string): void {
    const dateData: WordDataByGame | undefined = this.dataByDates.find(
      (dataItem: WordDataByGame): boolean => dataItem.getDateKey() === dateKey
    );
    if (dateData) {
      dateData.increaseCorrectAnswer(gameName);
    } else {
      const newDateData: WordDataByGame = new WordDataByGame(dateKey);
      newDateData.increaseCorrectAnswer(gameName);
      this.dataByDates.push(newDateData);
    }
  }

  public increaseIncorrectAnswers(gameName: GameName, dateKey: string): void {
    const dateData: WordDataByGame | undefined = this.dataByDates.find(
      (dataItem: WordDataByGame): boolean => dataItem.getDateKey() === dateKey
    );
    if (dateData) {
      dateData.increaseIncorrectAnswer(gameName);
    } else {
      const newDateData = new WordDataByGame(dateKey);
      newDateData.increaseIncorrectAnswer(gameName);
      this.dataByDates.push(newDateData);
    }
  }

  public update(info: IUserWord): UserWord {
    [
      this.difficulty,
      this.isLearned,
      this.dateOfLearning,
      this.correctAnswersInRow,
      this.gameOfFirstUse,
      this.dateOfFirstUse,
      this.dateOfMarkAsHard,
    ] = [
      info.difficulty,
      info.optional.isLearned,
      info.optional.dateOfLearning,
      info.optional.correctAnswersInRow,
      info.optional.gameNameOfFirstUse,
      info.optional.dateOfFirstUse,
      info.optional.dateOfMarkAsHard,
    ];
    const dateKeys: string[] = Object.keys(info.optional.dataByDates);
    this.dataByDates = dateKeys.map(
      (dateKey: string): WordDataByGame =>
        new WordDataByGame(dateKey).update(info.optional.dataByDates[dateKey])
    );
    return this;
  }

  public getUserWordInfo(): Omit<IUserWord, 'wordId'> {
    return {
      difficulty: this.difficulty,
      optional: {
        isLearned: this.isLearned,
        dateOfLearning: this.dateOfLearning,
        correctAnswersInRow: this.correctAnswersInRow,
        gameNameOfFirstUse: this.gameOfFirstUse,
        dateOfFirstUse: this.dateOfFirstUse,
        dateOfMarkAsHard: this.dateOfMarkAsHard,
        dataByDates: this.getDataByDates(),
      },
    };
  }

  public getProgress(): IUserWordDataByGame {
    const dateKeys: string[] = this.dataByDates.map((dataItem: WordDataByGame): string =>
      dataItem.getDateKey()
    );
    const gamesDataByDates: IUserWordGameDataByDate = this.getDataByDates();
    const progressEntries: [GameName, IAnswerCounter][] = (Object.keys(GAMES) as GameName[]).map(
      (game: GameName): [GameName, IAnswerCounter] => {
        const totalCounter: IAnswerCounter = {
          correctAnswersCounter: dateKeys.reduce(
            (sum: number, dateKey: string): number =>
              sum + gamesDataByDates[dateKey][game].correctAnswersCounter,
            Numbers.Zero
          ),
          incorrectAnswersCounter: dateKeys.reduce(
            (sum: number, dateKey: string): number =>
              sum + gamesDataByDates[dateKey][game].incorrectAnswersCounter,
            Numbers.Zero
          ),
        };
        return [game, totalCounter];
      }
    );
    return Object.fromEntries(progressEntries) as IUserWordDataByGame;
  }

  private getDataByDates(): IUserWordGameDataByDate {
    return Object.fromEntries(
      this.dataByDates.map((dataItem: WordDataByGame): [string, IUserWordDataByGame] => {
        const dataByGames: { dateKey: string; data: IUserWordDataByGame } = dataItem.getInfo();
        return [dataByGames.dateKey, dataByGames.data];
      })
    );
  }
}
