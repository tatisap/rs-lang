import StatisticUIConstructor from './ui-constructor';

export default class StatisticPage {
  private uiConstructor: StatisticUIConstructor;

  constructor() {
    this.uiConstructor = new StatisticUIConstructor();
  }

  renderPage() {
    const pageContainer: HTMLElement = document.getElementById('app') as HTMLElement;
    pageContainer.classList.add('page_statistic');
    pageContainer.append(
      this.uiConstructor.createPageTitle(),
      this.uiConstructor.createChartsContainer()
    );
  }
}
