import {MONTH_NAMES, NavigationType, RankType} from '../const';
import {NavItem} from './navigation';

export const shortenText = (text) => {
  const maxTextLength = 140;
  if (text.length > maxTextLength) {
    return text.slice(0, maxTextLength - 1) + '...';
  } else {
    return text;
  }
};

export const convertMinToTime = (minutes) => {
  return `${Math.trunc(minutes / 60)}h ${minutes % 60}m`;
};

export const getFullDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${day} ${MONTH_NAMES[month]} ${year}`;
};

export const getFullCommentDate = (date) => {
  const newDate = new Date(date);
  const day = newDate.getDate();
  const month = newDate.getMonth();
  const year = newDate.getFullYear();
  const hours = newDate.getHours();
  const min = newDate.getMinutes();

  return `${year}/${month}/${day} ${hours}:${min}`;
};

export const getAllWatchedFilmsCount = (films) => {
  return NavItem[NavigationType.WATCHED](films).length;
};

export const getAllWatchedFilmsDuration = (films) => {
  return NavItem[NavigationType.WATCHED](films).reduce((total, film) => {
    total = total + film.duration;
    return total;
  }, 0);
};

export const getAllWatchedFilmsToday = (films, dayPeriod = 0, monthPeriod = 0, yearPeriod = 0) => {
  const nowDate = new Date();

  const year = nowDate.getFullYear();
  const month = nowDate.getMonth();
  const day = nowDate.getDate();

  const finalDate = new Date(year - yearPeriod, month - monthPeriod, day - dayPeriod);

  return films.slice().filter((film) => {
    return film.watchedDate > finalDate;
  });
};

export const sortUpWatchedFilmsGenres = (films) => {
  const listGenres = {};

  const arrayAllGenres = films.reduce((total, film) => {
    total.push(...film.filmGenres);
    return total;
  }, []);

  arrayAllGenres.forEach((item) => {
    listGenres[item] = (listGenres[item] || 0) + 1;
  });

  return listGenres;
};

export const getProfileRank = (watchedFilms) => {
  const count = watchedFilms.length;
  if (count === 0) {
    return;
  }
  if (count >= 1 && count <= 10) {
    return RankType.NOVICE;
  }
  if (count >= 11 && count <= 20) {
    return RankType.FAN;
  }
  if (count >= 21) {
    return RankType.MOVIE_BUFF;
  }
};

const getWeightForNullData = (dataA, dataB) => {
  if (dataA === null && dataB === null) {
    return 0;
  }

  if (dataA === null) {
    return 1;
  }

  if (dataB === null) {
    return -1;
  }

  return null;
};

export const sortFilmsDate = (filmA, filmB) => {
  const weight = getWeightForNullData(filmA.releaseDate, filmB.releaseDate);

  if (weight !== null) {
    return weight;
  }

  return filmB.releaseDate.getTime() - filmA.releaseDate.getTime();
};

export const sortFilmsRating = (filmA, filmB) => {
  const weight = getWeightForNullData(filmA.rating, filmB.rating);

  if (weight !== null) {
    return weight;
  }

  return filmB.rating - filmA.rating;
};
