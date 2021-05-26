import {PeriodType} from '../const';

const getAllWatchedFilmsToday = (films, dayPeriod = 0, monthPeriod = 0, yearPeriod = 0) => {
  const nowDate = new Date();

  const year = nowDate.getFullYear();
  const month = nowDate.getMonth();
  const day = nowDate.getDate();

  const finalDate = new Date(year - yearPeriod, month - monthPeriod, day - dayPeriod);

  return films.slice().filter((film) => {
    return film.watchedDate > finalDate;
  });
};


export const getStatsWatchedFilmsForPeriod = {
  [PeriodType.ALL_TIME]: (films) => films,
  [PeriodType.TODAY]: (films) => getAllWatchedFilmsToday(films, 1),
  [PeriodType.WEEK]: (films) => getAllWatchedFilmsToday(films, 7),
  [PeriodType.MONTH]: (films) => getAllWatchedFilmsToday(films, 0, 1),
  [PeriodType.YEAR]: (films) => getAllWatchedFilmsToday(films, 0, 0, 1),
};
