import dayjs from 'dayjs';

export const randomInt = (a = 1, b = 0, floor = true) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return floor ? Math.floor(lower + Math.random() * (upper - lower + 1)) : Number((lower + Math.random() * (upper - lower + 1)).toFixed(1));
};

export const shortenText = (text, characters = 140) => {
  if (text.length > characters) {
    return text.slice(0, 139) + '...';
  }
};

export const getYear = (date) => {
  return dayjs(date).format('YYYY');
};

export const getFullDate = (date) => {
  return dayjs(date).format('d MMMM YYYY');
};
