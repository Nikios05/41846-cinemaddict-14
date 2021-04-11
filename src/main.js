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
const COUNT_FILMS_EXTRA_LIST = 2;
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

export const createFilmsListTemplate = (extraList, className, title, hiddenTitle = false) => {
  return `
    <section class="films-list films-list--${className} ${extraList && 'films-list--extra'}">
      <h2 class="films-list__title ${hiddenTitle && 'visually-hidden'}">${title}</h2>

      <div class="films-list__container">
      </div>
    </section>
  `;
};

export const createFooterStatistic = (filmCount) => {
  return `<p>${filmCount} movies inside</p>`;
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
render(filmsContainer, createFilmsListTemplate(false, 'all-list', 'All movies. Upcoming', true), 'afterbegin');

const allFilmsList = filmsContainer.querySelector('.films-list--all-list');
const allFilmsContainer = allFilmsList.querySelector('.films-list__container');
for (let i = 0; i < Math.min(films.length, COUNT_FILMS_PER_PAGE); i++) {
  render(allFilmsContainer, createFilmCard(films[i]), 'beforeend');
}

/* Show more button */
if (films.length > COUNT_FILMS_PER_PAGE) {
  let renderFilmCount = COUNT_FILMS_PER_PAGE;

  render(allFilmsList, createShowMoreBtn(), 'afterend');

  const loadMoreBtn = filmsContainer.querySelector('.films-list__show-more');

  loadMoreBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderFilmCount, renderFilmCount + COUNT_FILMS_PER_PAGE)
      .forEach((film) => render(allFilmsContainer, createFilmCard(film), 'beforeend'));

    renderFilmCount += COUNT_FILMS_PER_PAGE;

    if (renderFilmCount >= films.length) {
      loadMoreBtn.remove();
    }
  });
}

/* Top rated */
render(filmsContainer, createFilmsListTemplate(true, 'top-list', 'Top rated'), 'beforeend');

const topFilmTemplate = filmsContainer.querySelector('.films-list--top-list .films-list__container');
for (let i = 0; i < COUNT_FILMS_EXTRA_LIST; i++) {
  render(topFilmTemplate, createFilmCard(films[i]), 'afterbegin');
}

/* Most commented */
render(filmsContainer, createFilmsListTemplate(true, 'most-com-list', 'Most commented'), 'beforeend');

const mostCommentTemplate = filmsContainer.querySelector('.films-list--most-com-list .films-list__container');
for (let i = 0; i < COUNT_FILMS_EXTRA_LIST; i++) {
  render(mostCommentTemplate, createFilmCard(films[i]), 'afterbegin');
}


/* Footer */
const footerStatistics = document.querySelector('.footer__statistics');
render(footerStatistics, createFooterStatistic(COUNT_FILMS_VIEW), 'afterbegin');

// render(document.documentElement, createFilmDetails(films[0], comments), 'beforeend');
