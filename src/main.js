import {createNavigationTemplate} from './view/navigation';
import {createProfileTemplate} from './view/profile';
import {createFilmCard} from './view/film-card';
import {createShowMoreBtn} from './view/show-more-btn';

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

render(headerContainer, createProfileTemplate(), 'beforeend');
render(mainContainer, createNavigationTemplate(), 'afterbegin');
render(mainContainer, createFilmsTemplate(), 'beforeend');

const filmsContainer = document.querySelector('.films');

render(filmsContainer, createFilmsListTemplate('All movies. Upcoming', true), 'afterbegin');
render(filmsContainer, createFilmsListTemplate('Top rated', false, true), 'beforeend');
render(filmsContainer, createFilmsListTemplate('Most commented', false, true), 'beforeend');

const allFilmsListContainer = document.querySelectorAll('.films-list__container');
const countFilmsView = 5;
const countFilmsViewMore = 2;

render(allFilmsListContainer[0], createShowMoreBtn(), 'afterend');

for (let i = 0; i < countFilmsView; i++) {
  render(allFilmsListContainer[0], createFilmCard(), 'afterbegin');
}

for (let i = 0; i < countFilmsViewMore; i++) {
  render(allFilmsListContainer[1], createFilmCard(), 'afterbegin');
}

for (let i = 0; i < countFilmsViewMore; i++) {
  render(allFilmsListContainer[2], createFilmCard(), 'afterbegin');
}
