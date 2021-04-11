import {MONTH_NAME} from './const';

export const randomInt = (a = 1, b = 0, floor = true) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return floor ? Math.floor(lower + Math.random() * (upper - lower + 1)) : Number((lower + Math.random() * (upper - lower)).toFixed(1));
};

export const shortenText = (text) => {
  const maxTextLength = 140;
  if (text.length > maxTextLength) {
    return text.slice(0, maxTextLength - 1) + '...';
  }
};

export const getFullDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${day} ${MONTH_NAME[month]} ${year}`;
};

export const getRandomArrayElement = (arr) => {
  return arr[randomInt(0, arr.length - 1)];
};
