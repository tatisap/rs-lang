import { NO_DATA, NUMBER_OF_CORRECT_ANSWERS_TO_LEARN } from '../../constants';
import { GameName, IUserWord, IUserWordDataByGame, NoData, Numbers } from '../../types';
import WordDataByGame from './word-data-by-game';

export default class UserWord {
  private difficulty: 'easy' | 'hard';

  private isLearned: boolean;

  private dateOfLearning: string | NoData;

  private correctAnswersInRow: number;

  private gameOfFirstUse: GameName | NoData;

  private dateOfFirstUse: string | NoData;

  private dataByDates: WordDataByGame[];

  constructor() {
    this.difficulty = 'easy';
    this.isLearned = false;
    this.dateOfLearning = NO_DATA;
    this.correctAnswersInRow = Numbers.Zero;
    this.gameOfFirstUse = NO_DATA;
    this.dateOfFirstUse = NO_DATA;
    this.dataByDates = [];
  }

  public markAsEasy(): void {
    this.difficulty = 'easy';
  }

  public markAsHard(): void {
    this.difficulty = 'hard';
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

  public isNew(): boolean {
    return this.dateOfFirstUse === NO_DATA;
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
      const newDateData = new WordDataByGame(dateKey);
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
    ] = [
      info.difficulty,
      info.optional.isLearned,
      info.optional.dateOfLearning,
      info.optional.correctAnswersInRow,
      info.optional.gameNameOfFirstUse,
      info.optional.dateOfFirstUse,
    ];
    const dataEntries: [string, IUserWordDataByGame][] = Object.entries(info.optional.dataByDates);
    this.dataByDates = dataEntries.map(
      (dataItem: [string, IUserWordDataByGame]): WordDataByGame =>
        new WordDataByGame(dataItem[Numbers.Zero]).update(dataItem[Numbers.One])
    );
    return this;
  }

  public getUserWordInfo(): IUserWord {
    return {
      difficulty: this.difficulty,
      optional: {
        isLearned: this.isLearned,
        dateOfLearning: this.dateOfLearning,
        correctAnswersInRow: this.correctAnswersInRow,
        gameNameOfFirstUse: this.gameOfFirstUse,
        dateOfFirstUse: this.dateOfFirstUse,
        dataByDates: Object.fromEntries(
          this.dataByDates.map((dataItem: WordDataByGame): [string, IUserWordDataByGame] =>
            dataItem.getInfo()
          )
        ),
      },
    };
  }
}