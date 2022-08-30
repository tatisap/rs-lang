export const CHART_COLORS = {
  orange: 'rgb(255, 159, 64)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  transparentOrange: 'rgba(255, 159, 64, 0.2)',
  transparentBlue: 'rgba(54, 162, 235, 0.2)',
  transparentPurple: 'rgba(153, 102, 255, 0.2)',
};

export const CHART_LABELS = {
  xAxis: {
    perDay: 'За день',
  },
  yAxis: {
    wordAmount: 'Количество слов, шт',
  },
  legend: {
    newWords: 'Новые слова',
    learnedWords: 'Изученные слова',
    correctAnswers: 'Правильные ответы',
    maxCorrectAnswers: 'Макс. серия верных ответов',
  },
};

export const CHART_TITLES = {
  allTime: 'За все время',
  byGames: 'По играм',
  byWords: 'По словам',
};

export const DEFAULT_CONFIGS = {
  chartTitleFont: {
    size: 16,
  },
  yAxisTitle: {
    display: true,
    text: CHART_LABELS.yAxis.wordAmount,
  },
  lineTension: 0.1,
};

export const CHART_RESIZE_BREAKPOINT = 650;
