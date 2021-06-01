import {GapsProfileRank, MAX_DESCRIPTION_LENGTH, MONTH_NAMES, NavigationType, RankType, FormattedPeriod} from '../const';
import {NavItem} from './navigation';

export const shortenText = (text) => {
  if (text.length > MAX_DESCRIPTION_LENGTH) {
    return text.slice(0, MAX_DESCRIPTION_LENGTH - 1) + '...';
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


const getPeriodDate = (
  date,
  yearPeriod = 0,
  monthPeriod = 0,
  dayPeriod = 0,
  hoursPeriod = 0,
  minPeriod = 0,
) => {
  const nowDate = new Date(date);

  const nowYear = nowDate.getFullYear();
  const nowMonth = nowDate.getMonth();
  const nowDay = nowDate.getDate();
  const nowHours = nowDate.getHours();
  const nowMin = nowDate.getMinutes();

  return  new Date(nowYear + yearPeriod, nowMonth + monthPeriod, nowDay + dayPeriod, nowHours + hoursPeriod, nowMin + minPeriod);
};

export const getFormattedCommentDate = (date) => {
  const newDate = new Date(date);

  if (new Date() <= getPeriodDate(newDate, 0,0,0,0, FormattedPeriod.MINUTES_NOW)) {
    return 'now';
  }

  if (new Date() <= getPeriodDate(newDate,0,0,0,0, FormattedPeriod.MINUTES_FEW)) {
    return 'a few minutes ago';
  }

  if (new Date() <= getPeriodDate(newDate,0,0,0,0, FormattedPeriod.MINUTES)) {
    return `${new Date((new Date() - newDate)).getMinutes()} minutes ago`;
  }

  const compareYear = Math.abs(new Date().getFullYear() - newDate.getFullYear());
  if (new Date() < getPeriodDate(newDate,FormattedPeriod.YEAR,0,0,0, 0) && compareYear !== 0) {
    return `${compareYear} year(s) ago`;
  }

  const compareMonth = Math.abs(new Date().getMonth() - newDate.getMonth());
  if (new Date() <= getPeriodDate(newDate,0,FormattedPeriod.MONTH,0,0, 0) && compareMonth !== 0) {
    return `${compareMonth} month(s) ago`;
  }

  const compareDay = Math.abs(new Date().getDay() - newDate.getDay());
  if (new Date() <= getPeriodDate(newDate,0,0,FormattedPeriod.DAYS,0, 0) && compareDay !== 0) {
    return `${compareDay} day(s) ago`;
  }

  if (new Date() <= getPeriodDate(newDate,0,0,0,FormattedPeriod.HOURS, 0)) {
    return `${new Date((new Date() - newDate)).getHours()} hour(s) ago`;
  }
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

export const getAllWatchedFilmsFromPeriod = (films, dayPeriod = 0, monthPeriod = 0, yearPeriod = 0) => {
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
  if (count >= GapsProfileRank.NOVICE_MIN && count <= GapsProfileRank.NOVICE_MAX) {
    return RankType.NOVICE;
  }
  if (count >= GapsProfileRank.FAN_MIN && count <= GapsProfileRank.FAN_MAX) {
    return RankType.FAN;
  }
  if (count >= GapsProfileRank.MOVIE_BUFF_MIN) {
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
