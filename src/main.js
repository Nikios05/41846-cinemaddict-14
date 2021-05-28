import {render, RenderPosition} from './utils/render';

import Api from './api.js';
import {END_POINT, AUTHORIZATION, UpdateType} from './const';

import FilmsModel from './model/films';
import NavigationModel from './model/navigation';
import CommentsModel from './model/comments';

import FilmGridPresenter from './presenter/film-grid';
import NavigationPresenter from './presenter/navigation';

import FooterCounter from './view/footer-counter';

const api = new Api(END_POINT, AUTHORIZATION);

const navigationModel = new NavigationModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const headerContainer = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footerStatistics = document.querySelector('.footer__statistics');

const navigationPresenter = new NavigationPresenter(mainContainer, navigationModel, filmsModel);
const filmsPresenter = new FilmGridPresenter(mainContainer, headerContainer, filmsModel, commentsModel, navigationModel, api);

filmsPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  })
  .then(() => {
    navigationPresenter.init();
    render(footerStatistics, new FooterCounter(filmsModel.getFilms()), RenderPosition.AFTERBEGIN);
  });
