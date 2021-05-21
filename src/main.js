import ProfileView from './view/profile';
// import NavigationView from './view/navigation';

import {generateFilm} from './mock/film';
import {generateComment} from './mock/comments';

import {randomInt} from './utils/common';
import {createElement, render, RenderPosition} from './utils/render';

import FilmGridPresenter from './presenter/film-grid';
import NavigationPresenter from './presenter/navigation';

import FilmsModel from './model/films';
import NavigationModel from './model/navigation';
import CommentsModel from './model/comments';

import {nanoid} from 'nanoid';


/* Generate mock data */
const COUNT_FILMS_VIEW = 20;
const MAX_COMMENTS_TO_FILM = 5;

const films = new Array(COUNT_FILMS_VIEW).fill().map(() => {
  const comments = new Array(randomInt(0, MAX_COMMENTS_TO_FILM)).fill().map(() => {
    return generateComment(nanoid());
  });

  return generateFilm(comments);
});

// const filters = generateFilter(films);
/* --- */

const navigationModel = new NavigationModel();

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();

const headerContainer = document.querySelector('.header');
const mainContainer = document.querySelector('.main');

const createFooterStatistic = (filmCount) => {
  return createElement(`<p>${filmCount} movies inside</p>`);
};

const navigationPresenter = new NavigationPresenter(mainContainer, navigationModel, filmsModel);
const filmsPresenter = new FilmGridPresenter(mainContainer, filmsModel, commentsModel, navigationModel);

/* Profile */
render(headerContainer, new ProfileView(), RenderPosition.BEFOREEND);

/* Film Grid */
navigationPresenter.init();
filmsPresenter.init();

/* Footer */
const footerStatistics = document.querySelector('.footer__statistics');
render(footerStatistics, createFooterStatistic(COUNT_FILMS_VIEW), RenderPosition.AFTERBEGIN);
