import {render, RenderPosition} from './utils/render';

import Api from './api/api.js';
import {END_POINT, AUTHORIZATION, UpdateType, STORE_NAME} from './const';

import FilmsModel from './model/films';
import NavigationModel from './model/navigation';
import CommentsModel from './model/comments';

import FilmGridPresenter from './presenter/film-grid';
import NavigationPresenter from './presenter/navigation';

import FooterCounter from './view/footer-counter';
import Store from './api/store';
import Provider from './api/provider';
import {toast} from './utils/toast';

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const navigationModel = new NavigationModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const headerContainer = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footerStatistics = document.querySelector('.footer__statistics');

const navigationPresenter = new NavigationPresenter(mainContainer, navigationModel, filmsModel);
const filmsPresenter = new FilmGridPresenter(mainContainer, headerContainer, filmsModel, commentsModel, navigationModel, apiWithProvider);

filmsPresenter.init();

apiWithProvider.getFilms()
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

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  toast('Connection restored');
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  toast('Lost internet connection');
  document.title += ' [offline]';
});
