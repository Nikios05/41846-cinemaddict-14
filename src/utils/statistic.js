import {PeriodType} from '../const';
import {getAllWatchedFilmsToday} from './film-helper';


export const GetStatsWatchedFilmsForPeriod = {
  [PeriodType.ALL_TIME]: (films) => films,
  [PeriodType.TODAY]: (films) => getAllWatchedFilmsToday(films, 1),
  [PeriodType.WEEK]: (films) => getAllWatchedFilmsToday(films, 7),
  [PeriodType.MONTH]: (films) => getAllWatchedFilmsToday(films, 0, 1),
  [PeriodType.YEAR]: (films) => getAllWatchedFilmsToday(films, 0, 0, 1),
};
