import Chart from 'chart.js/auto';
import { CHART_RESIZE_BREAKPOINT, CHART_DEFAULT_CONFIGS } from '../../../constants/chart-defaults';
import { Numbers } from '../../../types';

Chart.defaults.onResize = (chart: Chart, size) => {
  const chartForResize: Chart = chart;
  if (size.width < CHART_RESIZE_BREAKPOINT) {
    chartForResize.options.aspectRatio = Numbers.One;
  } else {
    chartForResize.options.aspectRatio = Numbers.Two;
  }
};

Chart.defaults.datasets.bar.borderWidth = Numbers.One;
Chart.defaults.datasets.line.fill = false;
Chart.defaults.datasets.line.tension = CHART_DEFAULT_CONFIGS.lineTension;
Chart.defaults.scales.linear.beginAtZero = true;
Chart.defaults.plugins.title.display = true;
Chart.defaults.aspectRatio = Numbers.Two;

export default Chart;
