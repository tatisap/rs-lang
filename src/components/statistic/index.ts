import { IProcessedStatisticInfo } from '../../types';
import StatisticPageController from './controller';
import StatisticUIConstructor from './ui-constructor';

export default class StatisticPage {
  private uiConstructor: StatisticUIConstructor;

  private controller: StatisticPageController;

  constructor() {
    this.uiConstructor = new StatisticUIConstructor();
    this.controller = new StatisticPageController();
  }

  public async renderPage() {
    const pageContainer: HTMLElement = document.getElementById('app') as HTMLElement;
    pageContainer.classList.add('page_statistic');
    const chartsContainer: HTMLDivElement = this.uiConstructor.createChartsContainer();

    const statisticInfo: IProcessedStatisticInfo =
      await this.controller.getProcessedStatisticInfo();

    chartsContainer.append(
      this.uiConstructor.createDailyChartsTitle(),
      this.uiConstructor.createDailyGameChart(statisticInfo.dailyGameChartData),
      this.uiConstructor.createDailyWordChart(statisticInfo.dailyWordsChartData),
      this.uiConstructor.createAllTimeChartTitle(),
      this.uiConstructor.createAllTimeChart(statisticInfo.allTimeChartData)
    );

    pageContainer.append(this.uiConstructor.createPageTitle(), chartsContainer);
  }
}
