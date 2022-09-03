import StatisticAPI from '../../../api/statistic-api';
import { GAMES } from '../../../constants';
import { GameName, IUserStatistics, IUserStatisticsByDate, Numbers } from '../../../types';
import DateFormatter from '../../../utils/date-formatter';
import RequestProcessor from '../../request-processor';

export default class UserStatistics {
  private statisticApi: StatisticAPI;

  private requestProcessor: RequestProcessor;

  private dateFormatter: DateFormatter;

  private currentCorrectAnswerSeries: number;

  private dataByDates: {
    dateKey: string;
    maxCorrectAnswerSeries: IUserStatisticsByDate['date']['maxCorrectAnswerSeries'];
  }[];

  constructor() {
    this.statisticApi = new StatisticAPI();
    this.requestProcessor = new RequestProcessor();
    this.dateFormatter = new DateFormatter();
    this.currentCorrectAnswerSeries = Numbers.Zero;
    this.dataByDates = [];
  }

  public async init(): Promise<UserStatistics> {
    try {
      const info: IUserStatistics = await this.load();
      this.update(info);
      this.resetCurrentCorrectAnswerSeries();
      await this.save();
      return this;
    } catch {
      this.dataByDates.push(
        this.createEmptyDataForDate(this.dateFormatter.getStringifiedDateKey(new Date()))
      );
      await this.save();
      return this;
    }
  }

  public async load(): Promise<IUserStatistics> {
    const statisticsInfo: IUserStatistics = await this.requestProcessor.process(
      this.statisticApi.getUserStatistic
    );
    return statisticsInfo;
  }

  public async save(): Promise<void> {
    await this.requestProcessor.process(this.statisticApi.updateUserStatistic, {
      body: this.getInfo(),
    });
  }

  public increaseCurrentCorrectAnswerSeries(): UserStatistics {
    this.currentCorrectAnswerSeries += Numbers.One;
    return this;
  }

  public resetCurrentCorrectAnswerSeries(): UserStatistics {
    this.currentCorrectAnswerSeries = Numbers.Zero;
    return this;
  }

  public updateMaxCorrectAnswerSeries(game: GameName, dateKey: string): void {
    const dataForDate:
      | {
          dateKey: string;
          maxCorrectAnswerSeries: IUserStatisticsByDate['date']['maxCorrectAnswerSeries'];
        }
      | undefined = this.dataByDates.find(
      (dataItem: {
        dateKey: string;
        maxCorrectAnswerSeries: IUserStatisticsByDate['date']['maxCorrectAnswerSeries'];
      }): boolean => dataItem.dateKey === dateKey
    );
    if (dataForDate) {
      if (this.currentCorrectAnswerSeries > dataForDate.maxCorrectAnswerSeries[game]) {
        dataForDate.maxCorrectAnswerSeries[game] = this.currentCorrectAnswerSeries;
      }
    } else {
      const newDataForDate: {
        dateKey: string;
        maxCorrectAnswerSeries: IUserStatisticsByDate['date']['maxCorrectAnswerSeries'];
      } = this.createEmptyDataForDate(dateKey);
      newDataForDate.maxCorrectAnswerSeries[game] = this.currentCorrectAnswerSeries;
      this.dataByDates.push(newDataForDate);
    }
  }

  private createEmptyDataForDate(dateKey: string): {
    dateKey: string;
    maxCorrectAnswerSeries: IUserStatisticsByDate['date']['maxCorrectAnswerSeries'];
  } {
    const gameDataEntries: [GameName, number][] = (Object.keys(GAMES) as GameName[]).map(
      (game: GameName): [GameName, number] => [game, Numbers.Zero]
    );
    return {
      dateKey,
      maxCorrectAnswerSeries: Object.fromEntries(
        gameDataEntries
      ) as IUserStatisticsByDate['date']['maxCorrectAnswerSeries'],
    };
  }

  public update(data: IUserStatistics): UserStatistics {
    this.currentCorrectAnswerSeries = data.optional.currentCorrectAnswerSeries;
    console.log(data);
    this.dataByDates = Object.keys(data.optional.dataByDate).map(
      (
        dateKey: string
      ): {
        dateKey: string;
        maxCorrectAnswerSeries: IUserStatisticsByDate['date']['maxCorrectAnswerSeries'];
      } => {
        return {
          dateKey,
          maxCorrectAnswerSeries: { ...data.optional.dataByDate[dateKey].maxCorrectAnswerSeries },
        };
      }
    );
    return this;
  }

  public getInfo(): IUserStatistics {
    return {
      optional: {
        currentCorrectAnswerSeries: this.currentCorrectAnswerSeries,
        dataByDate: Object.fromEntries(
          this.dataByDates.map(
            (data: {
              dateKey: string;
              maxCorrectAnswerSeries: IUserStatisticsByDate['date']['maxCorrectAnswerSeries'];
            }): [string, IUserStatisticsByDate['date']] => [
              data.dateKey,
              { maxCorrectAnswerSeries: { ...data.maxCorrectAnswerSeries } },
            ]
          )
        ),
      },
    };
  }
}
