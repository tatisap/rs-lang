import WordsAPI from '../../api/words-api';
import { GAMES, MS_PER_DAY } from '../../constants';
import {
  GameName,
  IAllTimeChartData,
  IDailyGameChartData,
  IDailyWordChartData,
  IGameInfo,
  IProcessedStatisticInfo,
  IStatistics,
  IUserWord,
  Numbers,
  StatisticalDatesType,
} from '../../types';
import DateFormatter from '../../utils/date-formater';
import RequestProcessor from '../request-processor.ts';

export default class StatisticPageController {
  private api: WordsAPI;

  private requestProcessor: RequestProcessor;

  private dateFormatter: DateFormatter;

  constructor() {
    this.api = new WordsAPI();
    this.requestProcessor = new RequestProcessor();
    this.dateFormatter = new DateFormatter();
  }

  private getGameLabels(): string[] {
    return Object.values(GAMES).map((game: IGameInfo): string => game.name);
  }

  private getGameNames(): GameName[] {
    return Object.values(GAMES).map((game: IGameInfo): GameName => game.className as GameName);
  }

  public async getProcessedStatisticInfo(): Promise<IProcessedStatisticInfo> {
    const gameLabels: string[] = this.getGameLabels();
    const gameNames: GameName[] = this.getGameNames();
    const today: Date = new Date();
    const dateKey: string = this.dateFormatter.getStringifiedDateKey(today);

    const userWords: IUserWord[] = await this.requestProcessor.process<IUserWord[]>(
      this.api.getUserWords
    );

    const userStatistics: IStatistics = await this.requestProcessor.process<IStatistics>(
      this.api.getUserStatistic
    );

    const dailyGameChartData: IDailyGameChartData[] = this.getDailyGameChartData(
      gameLabels,
      gameNames,
      dateKey,
      userWords,
      userStatistics
    );

    const dailyWordsChartData: IDailyWordChartData = this.getDailyWordsChartData(
      gameNames,
      dateKey,
      userWords
    );

    const allTimeChartData: IAllTimeChartData[] = this.getAllTimeChartData(userWords, gameNames);

    return { dailyGameChartData, dailyWordsChartData, allTimeChartData };
  }

  private countNewWordsInGameForDate(
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

  private countNewWordsForDate(userWords: IUserWord[], gameNames: GameName[], dateKey: string) {
    return gameNames
      .map((gameName: GameName): number =>
        this.countNewWordsInGameForDate(userWords, gameName, dateKey)
      )
      .reduce((counter: number, newWordsInGame: number): number => counter + newWordsInGame);
  }

  private countCorrectAnswersInGameForDate(
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

  private countCorrectAnswersForDate(
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

  private countLearnedWordsForDate(userWords: IUserWord[], dateKey: string): number {
    return userWords.reduce((counter: number, userWord: IUserWord): number => {
      if (userWord.optional.dateOfLearning === dateKey) return counter + Numbers.One;
      return counter;
    }, Numbers.Zero);
  }

  public getDailyGameChartData(
    gameLabels: string[],
    gameNames: GameName[],
    date: string,
    userWords: IUserWord[],
    userStatistics: IStatistics
  ): IDailyGameChartData[] {
    return gameNames.map((gameName: GameName, index: number): IDailyGameChartData => {
      return {
        gameLabel: gameLabels[index],
        data: {
          newWords: this.countNewWordsInGameForDate(userWords, gameName, date),
          correctAnswers: this.countCorrectAnswersInGameForDate(userWords, gameName, date),
          maxCorrectAnswers: userStatistics.optional[date]?.maxCorrectAnswerSeries?.[gameName],
        },
      };
    });
  }

  public getDailyWordsChartData(
    gameNames: GameName[],
    dateKey: string,
    userWords: IUserWord[]
  ): IDailyWordChartData {
    return {
      newWords: this.countNewWordsForDate(userWords, gameNames, dateKey),
      learnedWords: this.countLearnedWordsForDate(userWords, dateKey),
      correctAnswers: this.countCorrectAnswersForDate(userWords, gameNames, dateKey),
    };
  }

  private getDateKeysByType(userWords: IUserWord[], dateType: StatisticalDatesType): string[] {
    return userWords
      .map((userWord: IUserWord) => userWord.optional[dateType])
      .filter((date: string): boolean => !!date);
  }

  public getAllTimeChartData(userWords: IUserWord[], gameNames: GameName[]): IAllTimeChartData[] {
    const dateKeys: string[] = Array.from(
      new Set([
        ...this.getDateKeysByType(userWords, 'dateOfLearning'),
        ...this.getDateKeysByType(userWords, 'dateOfFirstUse'),
      ])
    );

    const rawData: IAllTimeChartData[] = dateKeys.map((dateKey: string) => {
      return {
        date: this.dateFormatter.getDateByDateKey(dateKey),
        newWords: this.countNewWordsForDate(userWords, gameNames, dateKey),
        learnedWords: this.countLearnedWordsForDate(userWords, dateKey),
      };
    });

    rawData.sort(
      (a: IAllTimeChartData, b: IAllTimeChartData): number => a.date.getTime() - b.date.getTime()
    );

    const enrichedData: IAllTimeChartData[] = this.enrichAllTimeChartDataByDates(rawData);

    enrichedData.forEach((dataItem: IAllTimeChartData, index: number): void => {
      const currentDataItem: IAllTimeChartData = dataItem;
      if (index > Numbers.Zero)
        currentDataItem.learnedWords += enrichedData[index - Numbers.One].learnedWords;
    });

    return enrichedData;
  }

  private enrichAllTimeChartDataByDates(sortedRawData: IAllTimeChartData[]): IAllTimeChartData[] {
    const minDate: Date = sortedRawData[Numbers.Zero].date;
    const maxDate: Date = sortedRawData[sortedRawData.length - Numbers.One].date;

    const enrichedData: IAllTimeChartData[] = [];

    for (let i: number = minDate.getTime(); i <= maxDate.getTime(); i += MS_PER_DAY) {
      const date = new Date(i);
      enrichedData.push({
        date,
        newWords:
          sortedRawData.find(
            (data: IAllTimeChartData): boolean => data.date.getTime() === date.getTime()
          )?.newWords || Numbers.Zero,
        learnedWords:
          sortedRawData.find(
            (result: IAllTimeChartData): boolean => result.date.getTime() === date.getTime()
          )?.learnedWords || Numbers.Zero,
      });
    }
    return enrichedData;
  }
}
