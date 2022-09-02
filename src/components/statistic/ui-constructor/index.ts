import Chart from '../chart-config';
import { PAGE_TITLES } from '../../../constants';
import UIElementsConstructor from '../../../utils/ui-elements-creator';
import {
  CHART_COLORS,
  CHART_LABELS,
  CHART_TITLES,
  CHART_DEFAULT_CONFIGS,
  CORRECT_ANSWERS_PERCENTAGE_LABEL,
} from '../../../constants/chart-defaults';
import {
  IDailyChartDataByGame,
  IDailyChartDataForAllWords,
  ILongTermChartDataPerDate,
} from '../../../types';

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
    return this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['page__charts', 'charts'],
    });
  }

  public createDailyChartsTitle(): HTMLHeadingElement {
    const currentDate: string = new Date().toLocaleDateString();
    return this.elementCreator.createUIElement<HTMLHeadingElement>({
      tag: 'h3',
      classNames: ['charts__title'],
      innerText: currentDate,
    });
  }

  public createLongTermChartTitle(): HTMLHeadingElement {
    return this.elementCreator.createUIElement<HTMLHeadingElement>({
      tag: 'h3',
      classNames: ['charts__title'],
      innerText: CHART_TITLES.allTime,
    });
  }

  public createDailyCorrectAnswerPercentageInfo(
    dataByGames: IDailyChartDataByGame[],
    dataForAllWords: IDailyChartDataForAllWords
  ): HTMLDivElement {
    return this.elementCreator.createUIElement<HTMLDivElement>({
      tag: 'div',
      classNames: ['charts__percentage-info'],
      innerText: `${CORRECT_ANSWERS_PERCENTAGE_LABEL} ${
        dataForAllWords.correctAnswersPercentage
      }% (${dataByGames
        .map(
          (data: IDailyChartDataByGame): string =>
            `${data.gameLabel}: ${data.data.correctAnswersPercentage}%`
        )
        .join(', ')})`,
    });
  }

  private createCanvas(): HTMLCanvasElement {
    return this.elementCreator.createUIElement<HTMLCanvasElement>({
      tag: 'canvas',
      classNames: ['chart'],
    });
  }

  public createDailyChartByGames(statisticData: IDailyChartDataByGame[]): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = this.createCanvas();

    const chart: Chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: statisticData.map((data: IDailyChartDataByGame): string => data.gameLabel),
        datasets: [
          {
            label: CHART_LABELS.legend.newWords,
            data: statisticData.map((data: IDailyChartDataByGame): number => data.data.newWords),
            backgroundColor: CHART_COLORS.transparentOrange,
            borderColor: CHART_COLORS.orange,
          },
          {
            label: CHART_LABELS.legend.correctAnswers,
            data: statisticData.map(
              (data: IDailyChartDataByGame): number => data.data.correctAnswers
            ),
            backgroundColor: CHART_COLORS.transparentBlue,
            borderColor: CHART_COLORS.blue,
          },
          {
            label: CHART_LABELS.legend.maxCorrectAnswers,
            data: statisticData.map(
              (data: IDailyChartDataByGame): number => data.data.maxCorrectAnswers
            ),
            backgroundColor: CHART_COLORS.transparentPurple,
            borderColor: CHART_COLORS.purple,
          },
        ],
      },
    });

    chart.options = {
      scales: {
        y: {
          title: CHART_DEFAULT_CONFIGS.yAxisTitle,
        },
      },
      plugins: {
        title: {
          text: CHART_TITLES.byGames,
          font: CHART_DEFAULT_CONFIGS.chartTitleFont,
        },
      },
    };

    return canvas;
  }

  public createDailyChartForAllWords(statisticData: IDailyChartDataForAllWords): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = this.createCanvas();

    const chart: Chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: [CHART_LABELS.xAxis.perDay],
        datasets: [
          {
            label: CHART_LABELS.legend.newWords,
            data: [statisticData.newWords],
            backgroundColor: CHART_COLORS.transparentOrange,
            borderColor: CHART_COLORS.orange,
          },
          {
            label: CHART_LABELS.legend.learnedWords,
            data: [statisticData.learnedWords],
            backgroundColor: CHART_COLORS.transparentBlue,
            borderColor: CHART_COLORS.blue,
          },
          {
            label: CHART_LABELS.legend.correctAnswers,
            data: [statisticData.correctAnswers],
            backgroundColor: CHART_COLORS.transparentPurple,
            borderColor: CHART_COLORS.purple,
          },
        ],
      },
    });

    chart.options = {
      scales: {
        y: {
          title: CHART_DEFAULT_CONFIGS.yAxisTitle,
        },
      },
      plugins: {
        title: {
          text: CHART_TITLES.byWords,
          font: CHART_DEFAULT_CONFIGS.chartTitleFont,
        },
      },
    };

    return canvas;
  }

  public createLongTermChart(statisticData: ILongTermChartDataPerDate[]): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = this.createCanvas();

    const chart: Chart = new Chart(canvas, {
      type: 'scatter',
      data: {
        labels: statisticData.map((data: ILongTermChartDataPerDate): string =>
          data.date.toLocaleDateString()
        ),
        datasets: [
          {
            type: 'line',
            label: CHART_LABELS.legend.learnedWords,
            data: statisticData.map((data: ILongTermChartDataPerDate): number => data.learnedWords),
            borderColor: CHART_COLORS.purple,
          },
          {
            type: 'bar',
            label: CHART_LABELS.legend.newWords,
            data: statisticData.map((data: ILongTermChartDataPerDate): number => data.newWords),
            backgroundColor: CHART_COLORS.transparentBlue,
            borderColor: CHART_COLORS.blue,
          },
        ],
      },
    });

    chart.options = {
      scales: {
        y: {
          title: CHART_DEFAULT_CONFIGS.yAxisTitle,
        },
      },
    };

    return canvas;
  }
}
