import Chart from 'chart.js/auto';
import { DEFAULT_CONFIGS } from '../../constants/chart-defaults';
import { Numbers } from '../../types';

Chart.defaults.onResize = (chart: Chart, size) => {
  const chartForResize: Chart = chart;
  if (size.width < 650) {
    chartForResize.options.aspectRatio = Numbers.One;
  } else {
    chartForResize.options.aspectRatio = Numbers.Two;
  }
};

Chart.defaults.datasets.bar.borderWidth = Numbers.One;
Chart.defaults.datasets.line.fill = false;
Chart.defaults.datasets.line.tension = DEFAULT_CONFIGS.lineTension;
Chart.defaults.scales.linear.beginAtZero = true;
Chart.defaults.plugins.title.display = true;

export default Chart;
