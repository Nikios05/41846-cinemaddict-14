import {getFullDate, randomInt, getRandomArrayElement} from '../utils';
import {EMOTIONS} from '../const';

const possiblePeopleNames = [
  'John Cromwell',
  'Carole Lombard',
  'James Stewart',
  'Charles Coburn',
  'Lucile Watson',
];

const generateDescription = () => {
  const fullText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

  return fullText.split('.').slice(0, randomInt(1, 5)).join('.');
};

export const generateComment = (comment_id) => {
  return {
    id: comment_id,
    author: getRandomArrayElement(possiblePeopleNames),
    text: generateDescription(),
    date: getFullDate(new Date()),
    emotion: getRandomArrayElement(EMOTIONS),
  };
};
