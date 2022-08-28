import Chart from './charts-config';
import { PAGE_TITLES } from '../../constants';
import UIElementsConstructor from '../../utils/ui-elements-creator';
import {
  CHART_COLORS,
  CHART_LABELS,
  CHART_TITLES,
  DEFAULT_CONFIGS,
} from '../../constants/chart-defaults';

export default class StatisticUIConstructor {
  private elementCreator: UIElementsConstructor;

  constructor() {
    this.elementCreator = new UIElementsConstructor();
  }

  public createPageTitle(): HTMLHeadingElement {
    return this.elementCreator.createUIElement<HTMLHeadingElement>({
      tag: 'h2',
      classNames: ['page__title'],
      innerText: PAGE_TITLES.statistics,
    });
  }

  public createChartsContainer(): HTMLDivElement {
    const container: HTMLDivElement = this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['page__charts', 'charts'],
    });
    container.append(
      this.createDailyChartsTitle(),
      this.createDailyGameChart(),
      this.createDailyWordChart(),
      this.createAllTimeChartTitle(),
      this.createAllTimeChart()
    );
    return container;
  }

  public createDailyChartsTitle(): HTMLHeadingElement {
    const currentDate: string = new Date().toLocaleDateString();
    return this.elementCreator.createUIElement<HTMLHeadingElement>({
      tag: 'h3',
      classNames: ['charts__title'],
      innerText: currentDate,
    });
  }

  public createAllTimeChartTitle(): HTMLHeadingElement {
    return this.elementCreator.createUIElement<HTMLHeadingElement>({
      tag: 'h3',
      classNames: ['charts__title'],
      innerText: CHART_TITLES.allTime,
    });
  }

  private createCanvas(): HTMLCanvasElement {
    return this.elementCreator.createUIElement<HTMLCanvasElement>({
      tag: 'canvas',
      classNames: ['chart'],
    });
  }

  public createDailyGameChart(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = this.createCanvas();

    const chart: Chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Аудиовызов', 'Спринт'],
        datasets: [
          {
            label: CHART_LABELS.legend.newWords,
            data: [10, 15],
            backgroundColor: CHART_COLORS.transparentOrange,
            borderColor: CHART_COLORS.orange,
          },
          {
            label: CHART_LABELS.legend.correctAnswers,
            data: [6, 5],
            backgroundColor: CHART_COLORS.transparentBlue,
            borderColor: CHART_COLORS.blue,
          },
          {
            label: CHART_LABELS.legend.maxCorrectAnswers,
            data: [3, 3],
            backgroundColor: CHART_COLORS.transparentPurple,
            borderColor: CHART_COLORS.purple,
          },
        ],
      },
    });

    chart.options = {
      scales: {
        y: {
          title: DEFAULT_CONFIGS.yAxisTitle,
        },
      },
      plugins: {
        title: {
          text: CHART_TITLES.byGames,
          font: DEFAULT_CONFIGS.chartTitleFont,
        },
      },
    };

    return canvas;
  }

  public createDailyWordChart(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = this.createCanvas();

    const chart: Chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: [CHART_LABELS.xAxis.perDay],
        datasets: [
          {
            label: CHART_LABELS.legend.newWords,
            data: [10, 15],
            backgroundColor: CHART_COLORS.transparentOrange,
            borderColor: CHART_COLORS.orange,
          },
          {
            label: CHART_LABELS.legend.learnedWords,
            data: [6, 5],
            backgroundColor: CHART_COLORS.transparentBlue,
            borderColor: CHART_COLORS.blue,
          },
          {
            label: CHART_LABELS.legend.correctAnswers,
            data: [3, 3],
            backgroundColor: CHART_COLORS.transparentPurple,
            borderColor: CHART_COLORS.purple,
          },
        ],
      },
    });

    chart.options = {
      scales: {
        y: {
          title: DEFAULT_CONFIGS.yAxisTitle,
        },
      },
      plugins: {
        title: {
          text: CHART_TITLES.byWords,
          font: DEFAULT_CONFIGS.chartTitleFont,
        },
      },
    };

    return canvas;
  }

  public createAllTimeChart(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = this.createCanvas();

    const chart: Chart = new Chart(canvas, {
      type: 'scatter',
      data: {
        labels: ['24/08/2022', '25/08/2022', '26/08/2022', '27/08/2022'],
        datasets: [
          {
            type: 'line',
            label: CHART_LABELS.legend.learnedWords,
            data: [10, 50, 100, 360],
            borderColor: CHART_COLORS.purple,
          },
          {
            type: 'bar',
            label: CHART_LABELS.legend.newWords,
            data: [10, 40, 50, 300],
            backgroundColor: CHART_COLORS.transparentBlue,
            borderColor: CHART_COLORS.blue,
          },
        ],
      },
    });

    chart.options = {
      scales: {
        y: {
          title: DEFAULT_CONFIGS.yAxisTitle,
        },
      },
    };

    return canvas;
  }
}
