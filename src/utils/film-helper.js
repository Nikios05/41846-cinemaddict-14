import {MONTH_NAME} from '../const';

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
