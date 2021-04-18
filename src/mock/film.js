import {randomInt, getRandomArrayElement} from '../utils/common';

const possibleCountry = [
  'Russian',
  'Ukraine',
  'USA',
  'England',
  'France',
];

const possibleGenres = [
  'Musical',
  'Thriller',
  'Comedy',
  'Fiction',
  'Western',
];

const possiblePeopleNames = [
  'John Cromwell',
  'Carole Lombard',
  'James Stewart',
  'Charles Coburn',
  'Lucile Watson',
];

const possibleFilmNames = [
  'Made for each other',
  'Popeye meets sinbad',
  'Sagebrush trail',
  'Santa claus conquers the martians',
  'The dance of life',
  'The great flamarion',
  'The man with the golden arm',
];

const possibleImgPosterNames = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const generateDescription = () => {
  const fullText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

  return fullText.split('.').slice(0, randomInt(1, 5)).join('.');
};

const generateDuration = () => {
  const randomDurationMin = randomInt(40, 240);
  const hours = Math.trunc(randomDurationMin / 60);
  const min = randomDurationMin % 60;

  return `${hours}h ${min}m`;
};

const generateReleaseDate = () => {
  const yearGap = randomInt(0, 60);
  const year = new Date().getFullYear();
  const maxMonthCount = 12;
  const maxDayCount = 28;
  return new Date(randomInt(year - yearGap, year), randomInt(0, maxMonthCount), randomInt(1, maxDayCount));
};

const generateAgeRating = () => {
  const maxAge = 18;
  const minAge = 6;
  return randomInt(minAge, maxAge);
};

const generateRatingFilm = () => {
  const maxRating = 10;
  const minRating = 0;
  return randomInt(minRating, maxRating, false);
};

const generateParticipantsFilm = () => {
  return possiblePeopleNames.slice(0, randomInt(1, possiblePeopleNames.length));
};

const generateFilmGenres = () => {
  const filmGenres = possibleGenres.slice(0, randomInt(1, possibleGenres.length));
  return filmGenres.sort(() => 0.5 - Math.random());
};

export const generateFilm = (comments) => {
  return {
    posterUrl: getRandomArrayElement(possibleImgPosterNames),
    filmName: getRandomArrayElement(possibleFilmNames),
    originFilmName: getRandomArrayElement(possibleFilmNames),
    rating: generateRatingFilm(),
    releaseDate: generateReleaseDate(),
    country: getRandomArrayElement(possibleCountry),
    duration: generateDuration(),
    filmGenres: generateFilmGenres(),
    description: generateDescription(),
    director: getRandomArrayElement(possiblePeopleNames),
    screenwriters: generateParticipantsFilm(),
    cast: generateParticipantsFilm(),
    ageRating: generateAgeRating(),
    inWatchlist: !!randomInt(),
    isWatched: !!randomInt(),
    isFavorite: !!randomInt(),
    comments: comments,
  };
};
