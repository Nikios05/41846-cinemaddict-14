import {createNavigationTemplate} from './view/navigation';
import {createProfileTemplate} from './view/profile';
import {createFilmCard} from './view/film-card';
import {createShowMoreBtn} from './view/show-more-btn';
// import {createFilmDetails} from './view/film-details';

import {generateFilm} from './mock/film';
import {generateFilter} from './mock/filter';
import {generateComment} from './mock/comments';

import {randomInt} from './utils';

const COUNT_FILMS_VIEW = 20;
const COUNT_FILMS_PER_PAGE = 5;

const MAX_COMMENTS_TO_FILM = 5;

const films = new Array(COUNT_FILMS_VIEW).fill().map(() => {
  const comments = new Array(randomInt(0, MAX_COMMENTS_TO_FILM)).fill().map((_, index) => {
    return generateComment(index + 1);
  });

  return generateFilm(comments);
});
const filters = generateFilter(films);

export const createFilmsTemplate = () => {
  return `
    <section class="films">
    </section>
  `;
};

export const createFilmsListTemplate = (title, hiddenTitle, extraList) => {
  return `
    <section class="films-list ${extraList ? 'films-list--extra' : ''}">
      <h2 class="films-list__title ${hiddenTitle ? 'visually-hidden' : ''}">${title}</h2>

      <div class="films-list__container">
      </div>
    </section>
  `;
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerContainer = document.querySelector('.header');
const mainContainer = document.querySelector('.main');

/* Profile */
render(headerContainer, createProfileTemplate(), 'beforeend');
/* Navigation / Filter */
render(mainContainer, createNavigationTemplate(filters), 'afterbegin');
/* Films grid */
render(mainContainer, createFilmsTemplate(), 'beforeend');

const filmsContainer = document.querySelector('.films');

/* All movies */
render(filmsContainer, createFilmsListTemplate('All movies. Upcoming', true), 'afterbegin');
/* Top rated */
render(filmsContainer, createFilmsListTemplate('Top rated', false, true), 'beforeend');
/* Most commented */
render(filmsContainer, createFilmsListTemplate('Most commented', false, true), 'beforeend');

const allFilmsListContainer = document.querySelectorAll('.films-list__container');

for (let i = 0; i < Math.min(films.length, COUNT_FILMS_PER_PAGE); i++) {
  render(allFilmsListContainer[0], createFilmCard(films[i]), 'beforeend');
}

/* Show more button */
if (films.length > COUNT_FILMS_PER_PAGE) {
  let renderFilmCount = COUNT_FILMS_PER_PAGE;

  render(allFilmsListContainer[0], createShowMoreBtn(), 'afterend');

  const loadMoreBtn = filmsContainer.querySelector('.films-list__show-more');

  loadMoreBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderFilmCount, renderFilmCount + COUNT_FILMS_PER_PAGE)
      .forEach((film) => render(allFilmsListContainer[0], createFilmCard(film), 'beforeend'));

    renderFilmCount += COUNT_FILMS_PER_PAGE;

    if (renderFilmCount >= films.length) {
      loadMoreBtn.remove();
    }
  });
}

for (let i = 0; i < 2; i++) {
  render(allFilmsListContainer[1], createFilmCard(films[i]), 'afterbegin');
}

for (let i = 0; i < 2; i++) {
  render(allFilmsListContainer[2], createFilmCard(films[i]), 'afterbegin');
}

/* Footer */
const footerStatistics = document.querySelector('.footer__statistics');
const filmCountParagraph = document.createElement('p');
filmCountParagraph.innerHTML = `${COUNT_FILMS_VIEW} movies inside`;
footerStatistics.appendChild(filmCountParagraph);

// render(document.documentElement, createFilmDetails(films[0], comments), 'beforeend');
