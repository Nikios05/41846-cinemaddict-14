import ProfileView from './view/profile';
import NavigationView from './view/navigation';

import {generateFilm} from './mock/film';
import {generateFilter} from './mock/filter';
import {generateComment} from './mock/comments';

import {randomInt} from './utils/common';
import {createElement, render, RenderPosition} from './utils/render';

import FilmGridPresenter from './presenter/film-grid';


/* Generate mock data */
const COUNT_FILMS_VIEW = 20;
const MAX_COMMENTS_TO_FILM = 5;

const films = new Array(COUNT_FILMS_VIEW).fill().map(() => {
  const comments = new Array(randomInt(0, MAX_COMMENTS_TO_FILM)).fill().map((_, index) => {
    return generateComment(index + 1);
  });

  return generateFilm(comments);
});

const filters = generateFilter(films);
/* --- */

const headerContainer = document.querySelector('.header');
const mainContainer = document.querySelector('.main');

const createFooterStatistic = (filmCount) => {
  return createElement(`<p>${filmCount} movies inside</p>`);
};

const filmsPresenter = new FilmGridPresenter(mainContainer);

/* Profile */
render(headerContainer, new ProfileView(), RenderPosition.BEFOREEND);

/* Navigation / Filter */
render(mainContainer, new NavigationView(filters), RenderPosition.AFTERBEGIN);

/* Film Grid */
filmsPresenter.init(films);

/* Footer */
const footerStatistics = document.querySelector('.footer__statistics');
render(footerStatistics, createFooterStatistic(COUNT_FILMS_VIEW), RenderPosition.AFTERBEGIN);
