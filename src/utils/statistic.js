import {PeriodType} from '../const';
import {getAllWatchedFilmsFromPeriod} from './film-helper';


export const GetStatsWatchedFilmsForPeriod = {
  [PeriodType.ALL_TIME]: (films) => films,
  [PeriodType.TODAY]: (films) => getAllWatchedFilmsFromPeriod(films, 1),
  [PeriodType.WEEK]: (films) => getAllWatchedFilmsFromPeriod(films, 7),
  [PeriodType.MONTH]: (films) => getAllWatchedFilmsFromPeriod(films, 0, 1),
  [PeriodType.YEAR]: (films) => getAllWatchedFilmsFromPeriod(films, 0, 0, 1),
};
