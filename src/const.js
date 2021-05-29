export const AUTHORIZATION = 'Basic gs4Sh2dqSwsl6nb2j';
export const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

export const COUNT_FILMS_PER_PAGE = 5;
export const COUNT_FILMS_EXTRA_LIST = 2;
export const SHAKE_DURATION = 300;
export const MAX_DESCRIPTION_LENGTH = 140;

export const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const PeriodType = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const RankType = {
  NO_RANK: null,
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

export const GapsProfileRank = {
  NOVICE_MIN: 1,
  NOVICE_MAX: 10,
  FAN_MIN: 11,
  FAN_MAX: 20,
  MOVIE_BUFF_MIN: 21,
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const NavigationType = {
  ALL: 'all_movies',
  WATCHLIST: 'watchlist',
  WATCHED: 'watched',
  FAVORITES: 'favorites',
  STATS: 'stats',
};

export const NavigationTypeText = {
  ALL: 'All movies',
  WATCHLIST: 'watchlist',
  WATCHED: 'watched',
  FAVORITES: 'favorites',
  STATS: 'Stats',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  REMOVE_COMMENT: 'REMOVE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  PATCH_COMMENTS_LIST: 'PATCH_COMMENTS_LIST',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};
