import ProfileView from './view/profile';
import NavigationView from './view/navigation';
import FilmListView from './view/film-list';
import FilmCardView from './view/film-card';
import MoreButtonView from './view/show-more-btn';
import FilmDetails from './view/film-details';

import {generateFilm} from './mock/film';
import {generateFilter} from './mock/filter';
import {generateComment} from './mock/comments';
import {randomInt} from './utils/common';
import {createElement, remove, render, RenderPosition} from './utils/render';

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

const headerContainer = document.querySelector('.header');
const mainContainer = document.querySelector('.main');

const createFilmsTemplate = () => {
  return createElement(`
    <section class="films">
    </section>
  `);
};

const createFooterStatistic = (filmCount) => {
  return createElement(`<p>${filmCount} movies inside</p>`);
};

const renderFilmCard = (filmsListElement, film) => {
  const filmComponent = new FilmCardView(film);
  const filmDetailsComponent = new FilmDetails(film);

  const showDerailsFilm = () => {
    const openedDetailsFilm = document.querySelector('.film-details');
    if (openedDetailsFilm) {
      return;
    }
    document.body.classList.add('hide-overflow');
    render(document.body, filmDetailsComponent, RenderPosition.BEFOREEND);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      filmDetailsComponent.closeDerailFilm();
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  filmComponent.setClickHandler(() => {
    showDerailsFilm();
    document.addEventListener('keydown', onEscKeyDown);

    filmDetailsComponent.setCloseBtnHandler(() => {
      document.removeEventListener('keydown', onEscKeyDown);
    });
  });

  render(filmsListElement, filmComponent, RenderPosition.BEFOREEND);
};

/* Profile */
render(headerContainer, new ProfileView(), RenderPosition.BEFOREEND);
/* Navigation / Filter */
render(mainContainer, new NavigationView(filters), RenderPosition.AFTERBEGIN);
/* Films grid */
render(mainContainer, createFilmsTemplate(), RenderPosition.BEFOREEND);

const filmsContainer = document.querySelector('.films');

/* All movies */
const allFilmsList = new FilmListView(false, 'all-list', 'All movies. Upcoming', true);
render(filmsContainer, allFilmsList, RenderPosition.AFTERBEGIN);

const allFilmsContainer = allFilmsList.getElement().querySelector('.films-list__container');
for (let i = 0; i < Math.min(films.length, COUNT_FILMS_PER_PAGE); i++) {
  renderFilmCard(allFilmsContainer, films[i]);
}

/* Show more button */
if (films.length > COUNT_FILMS_PER_PAGE) {
  const loadMoreBtn = new MoreButtonView();

  let renderTemplateFilmCount = COUNT_FILMS_PER_PAGE;

  render(allFilmsList, loadMoreBtn, RenderPosition.BEFOREEND);

  loadMoreBtn.setClickHandler(() => {
    films
      .slice(renderTemplateFilmCount, renderTemplateFilmCount + COUNT_FILMS_PER_PAGE)
      .forEach((film) => renderFilmCard(allFilmsContainer, film));

    renderTemplateFilmCount += COUNT_FILMS_PER_PAGE;

    if (renderTemplateFilmCount >= films.length) {
      remove(loadMoreBtn);
    }
  });
}

/* Top rated */
const topFilmTemplate = new FilmListView(true, 'top-list', 'Top rated');
render(filmsContainer, topFilmTemplate, RenderPosition.BEFOREEND);

const topFilmContainer = topFilmTemplate.getElement().querySelector('.films-list__container');
for (let i = 0; i < COUNT_FILMS_EXTRA_LIST; i++) {
  renderFilmCard(topFilmContainer, films[i]);
}

/* Most commented */
const mostFilmTemplate = new FilmListView(true, 'most-com-list', 'Most commented');
render(filmsContainer, mostFilmTemplate, RenderPosition.BEFOREEND);

const mostCommentTemplate = mostFilmTemplate.getElement().querySelector('.films-list--most-com-list .films-list__container');
for (let i = 0; i < COUNT_FILMS_EXTRA_LIST; i++) {
  renderFilmCard(mostCommentTemplate, films[i]);
}

/* Footer */
const footerStatistics = document.querySelector('.footer__statistics');
render(footerStatistics, createFooterStatistic(COUNT_FILMS_VIEW), RenderPosition.AFTERBEGIN);
