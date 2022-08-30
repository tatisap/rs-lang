import { UNAUTHORIZED_MESSAGE } from '../../constants';
import { IProcessedStatisticInfo } from '../../types';
import AuthController from '../auth/auth-controller';
import StatisticPageController from './controller';
import StatisticUIConstructor from './ui-constructor';

export default class StatisticPage {
  private uiConstructor: StatisticUIConstructor;

  private pageController: StatisticPageController;

  private authController: AuthController;

  constructor() {
    this.uiConstructor = new StatisticUIConstructor();
    this.pageController = new StatisticPageController();
    this.authController = new AuthController();
  }

  public async renderPage(): Promise<void> {
    const pageContainer: HTMLElement = document.getElementById('app') as HTMLElement;
    pageContainer.classList.add('page_statistic');

    if (!this.authController.isUserAuthorized()) {
      this.showUnauthorizedMessage(pageContainer);
      return;
    }

    const chartsContainer: HTMLDivElement = this.uiConstructor.createChartsContainer();

    const statisticInfo: IProcessedStatisticInfo =
      await this.pageController.getProcessedStatisticInfo();

    chartsContainer.append(
      this.uiConstructor.createDailyChartsTitle(),
      this.uiConstructor.createDailyChartByGames(statisticInfo.dailyChartDataByGames),
      this.uiConstructor.createDailyChartForAllWords(statisticInfo.dailyChartDataForAllWords),
      this.uiConstructor.createDailyCorrectAnswerPercentageInfo(
        statisticInfo.dailyChartDataByGames,
        statisticInfo.dailyChartDataForAllWords
      ),
      this.uiConstructor.createLongTermChartTitle(),
      this.uiConstructor.createLongTermChart(statisticInfo.longTermChartData)
    );

    pageContainer.append(this.uiConstructor.createPageTitle(), chartsContainer);
  }

  private showUnauthorizedMessage(pageContainer: HTMLElement): void {
    const container: HTMLElement = pageContainer;
    container.innerHTML = UNAUTHORIZED_MESSAGE;
  }
}
