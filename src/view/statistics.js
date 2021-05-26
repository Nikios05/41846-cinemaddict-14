import SmartView from './smart-view';
import {
  getAllWatchedFilmsCount,
  getAllWatchedFilmsDuration, getProfileRank,
  sortUpWatchedFilmsGenres
} from '../utils/film-helper';

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {GetStatsWatchedFilmsForPeriod} from '../utils/statistic';
import {PeriodType} from '../const';

const renderChart = (statisticCtx, films) => {

  if (films.length === 0) {
    return false;
  }

  const genres = [];
  const counts = [];

  Object
    .entries(sortUpWatchedFilmsGenres(films))
    .sort((a, b) => b[1] - a[1])
    .forEach(([label, count]) => {
      genres.push(label);
      counts.push(count);
    });

  const BAR_HEIGHT = 50;

  statisticCtx.height = BAR_HEIGHT * Object.values(genres).length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genres,
      datasets: [{
        data: counts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTotalDuration = (films) => {
  const minutes = getAllWatchedFilmsDuration(films) % 60;
  const hours = Math.trunc(getAllWatchedFilmsDuration(films) / 60);

  return `<p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>`;
};

const renderTopGenre = (films) => {
  const listGenres = sortUpWatchedFilmsGenres(films);
  const topGenre = Object.keys(listGenres).sort((a, b) => listGenres[b] - listGenres[a])[0];
  return `<p class="statistic__item-text">${topGenre ? topGenre : ''}</p>`;
};

const renderPeriodList = (currentPeriod) => {
  return Object.values(PeriodType).map((period) => `
    <input type="radio"
           class="statistic__filters-input visually-hidden"
           name="statistic-filter" id="statistic-${period}"
           value="${period}"
           ${currentPeriod === period ? 'checked' : ''}>
    <label for="statistic-${period}"
           class="statistic__filters-label">
           ${period[0].toUpperCase() + period.slice(1)}
    </label>`).join('');
};

const createStatisticsTemplate = ({films, currentPeriod, allWatchedFilms}) => {
  const periodListTemplate = renderPeriodList(currentPeriod);
  const totalDurationTemplate = renderTotalDuration(films);
  const TopGenreTemplate = renderTopGenre(films);

  return `
    <section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${allWatchedFilms.length ? getProfileRank(allWatchedFilms) : ''}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        ${periodListTemplate}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${getAllWatchedFilmsCount(films)} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          ${totalDurationTemplate}
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          ${TopGenreTemplate}
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`;
};

export default class Statistics extends SmartView {
  constructor(films) {
    super();

    this._films = films;
    this._currentPeriod = PeriodType.ALL_TIME;
    this._data = {films: this._films, currentPeriod: this._currentPeriod, allWatchedFilms: this._films.filter((film) => film.isWatched)};
    this._chart = null;
    this._periodChangeHandler = this._periodChangeHandler.bind(this);

    this._setInnerHandler();
    this._setCharts();
  }

  _setInnerHandler() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._periodChangeHandler);
  }

  _periodChangeHandler(evt) {
    evt.preventDefault();

    if (this._currentPeriod === evt.target.value) {
      return;
    }
    this._currentPeriod = evt.target.value;
    const filteredFilms = GetStatsWatchedFilmsForPeriod[this._currentPeriod](this._films);

    this.updateData({
      films: filteredFilms,
      currentPeriod: this._currentPeriod,
    });
  }

  _setCharts() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._chart = renderChart(statisticCtx, this._data.films);
  }

  getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandler();
    this._setCharts();
  }
}
