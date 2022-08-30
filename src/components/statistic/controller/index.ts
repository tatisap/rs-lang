import WordsAPI from '../../../api/words-api';
import { GAMES, MS_PER_DAY } from '../../../constants';
import {
  GameName,
  IDailyChartDataByGame,
  IDailyChartDataForAllWords,
  IGameInfo,
  ILongTermChartDataPerDate,
  IProcessedStatisticInfo,
  IUserStatistics,
  IUserWord,
  Numbers,
  StatisticalDateKeysType,
} from '../../../types';
import DateFormatter from '../../../utils/date-formatter';
import RequestProcessor from '../../request-processor';
import StatisticCounter from './counter';

export default class StatisticPageController {
  private api: WordsAPI;

  private requestProcessor: RequestProcessor;

  private dateFormatter: DateFormatter;

  private counter: StatisticCounter;

  constructor() {
    this.api = new WordsAPI();
    this.requestProcessor = new RequestProcessor();
    this.dateFormatter = new DateFormatter();
    this.counter = new StatisticCounter();
  }

  public async getProcessedStatisticInfo(): Promise<IProcessedStatisticInfo> {
    const gameLabels: string[] = this.getGameLabels();
    const gameNames: GameName[] = this.getGameNames();
    const today: Date = new Date();
    const dateKey: string = this.dateFormatter.getStringifiedDateKey(today);

    const userWords: IUserWord[] = await this.requestProcessor.process<IUserWord[]>(
      this.api.getUserWords
    );

    const userStatistics: IUserStatistics = await this.requestProcessor.process<IUserStatistics>(
      this.api.getUserStatistic
    );

    const dailyChartDataByGames: IDailyChartDataByGame[] = this.getDailyGameChartData(
      gameLabels,
      gameNames,
      dateKey,
      userWords,
      userStatistics
    );

    const dailyChartDataForAllWords: IDailyChartDataForAllWords = this.getDailyWordsChartData(
      gameNames,
      dateKey,
      userWords
    );

    const longTermChartData: ILongTermChartDataPerDate[] = this.getAllTimeChartData(
      userWords,
      gameNames
    );

    return { dailyChartDataByGames, dailyChartDataForAllWords, longTermChartData };
  }

  public getDailyGameChartData(
    gameLabels: string[],
    gameNames: GameName[],
    date: string,
    userWords: IUserWord[],
    userStatistics: IUserStatistics
  ): IDailyChartDataByGame[] {
    return gameNames.map((gameName: GameName, index: number): IDailyChartDataByGame => {
      return {
        gameLabel: gameLabels[index],
        data: {
          newWords: this.counter.countNewWordsInGameForDate(userWords, gameName, date),
          correctAnswers: this.counter.countCorrectAnswersInGameForDate(userWords, gameName, date),
          maxCorrectAnswers: userStatistics.optional[date]?.maxCorrectAnswerSeries?.[gameName],
        },
      };
    });
  }

  public getDailyWordsChartData(
    gameNames: GameName[],
    dateKey: string,
    userWords: IUserWord[]
  ): IDailyChartDataForAllWords {
    return {
      newWords: this.counter.countNewWordsForDate(userWords, gameNames, dateKey),
      learnedWords: this.counter.countLearnedWordsForDate(userWords, dateKey),
      correctAnswers: this.counter.countCorrectAnswersForDate(userWords, gameNames, dateKey),
    };
  }

  public getAllTimeChartData(
    userWords: IUserWord[],
    gameNames: GameName[]
  ): ILongTermChartDataPerDate[] {
    const dateKeys: string[] = Array.from(
      new Set([
        ...this.getDateKeysByType(userWords, 'dateOfLearning'),
        ...this.getDateKeysByType(userWords, 'dateOfFirstUse'),
      ])
    );

    const rawData: ILongTermChartDataPerDate[] = dateKeys.map((dateKey: string) => {
      return {
        date: this.dateFormatter.getDateByDateKey(dateKey),
        newWords: this.counter.countNewWordsForDate(userWords, gameNames, dateKey),
        learnedWords: this.counter.countLearnedWordsForDate(userWords, dateKey),
      };
    });

    rawData.sort(
      (a: ILongTermChartDataPerDate, b: ILongTermChartDataPerDate): number =>
        a.date.getTime() - b.date.getTime()
    );

    const enrichedData: ILongTermChartDataPerDate[] = this.enrichAllTimeChartDataByDates(rawData);

    enrichedData.forEach((dataItem: ILongTermChartDataPerDate, index: number): void => {
      const currentDataItem: ILongTermChartDataPerDate = dataItem;
      if (index > Numbers.Zero)
        currentDataItem.learnedWords += enrichedData[index - Numbers.One].learnedWords;
    });

    return enrichedData;
  }

  private getGameLabels(): string[] {
    return Object.values(GAMES).map((game: IGameInfo): string => game.name);
  }

  private getGameNames(): GameName[] {
    return Object.values(GAMES).map((game: IGameInfo): GameName => game.className as GameName);
  }

  private getDateKeysByType(userWords: IUserWord[], dateType: StatisticalDateKeysType): string[] {
    return userWords
      .map((userWord: IUserWord) => userWord.optional[dateType])
      .filter((date: string): boolean => !!date);
  }

  private enrichAllTimeChartDataByDates(
    sortedRawData: ILongTermChartDataPerDate[]
  ): ILongTermChartDataPerDate[] {
    const minDate: Date = sortedRawData[Numbers.Zero].date;
    const maxDate: Date = sortedRawData[sortedRawData.length - Numbers.One].date;

    const enrichedData: ILongTermChartDataPerDate[] = [];

    for (let i: number = minDate.getTime(); i <= maxDate.getTime(); i += MS_PER_DAY) {
      const date = new Date(i);
      enrichedData.push({
        date,
        newWords:
          sortedRawData.find(
            (data: ILongTermChartDataPerDate): boolean => data.date.getTime() === date.getTime()
          )?.newWords || Numbers.Zero,
        learnedWords:
          sortedRawData.find(
            (result: ILongTermChartDataPerDate): boolean => result.date.getTime() === date.getTime()
          )?.learnedWords || Numbers.Zero,
      });
    }
    return enrichedData;
  }
}
