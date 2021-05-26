import {NavigationType} from '../const';

export const NavItem = {
  [NavigationType.ALL]: (films) => films,
  [NavigationType.WATCHLIST]: (films) => films.filter((film) => film.inWatchlist),
  [NavigationType.WATCHED]: (films) => films.filter((film) => film.isWatched),
  [NavigationType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
  [NavigationType.STATS]: () => [],
};
