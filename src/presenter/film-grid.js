import {remove, render, RenderPosition} from '../utils/render';
import {updateItem} from '../utils/common';

import FilmListView from '../view/film-list';
import SortView from '../view/sort';
import FilmsGrid from '../view/films-grid';
import MoreButtonView from '../view/show-more-btn';

import FilmCardPresenter from '../presenter/film-card';

const COUNT_FILMS_PER_PAGE = 5;
const COUNT_FILMS_EXTRA_LIST = 2;

export default class FilmGrid {
  constructor(mainContainer) {
    this._mainContainer = mainContainer;
    this._renderFilmCount = COUNT_FILMS_PER_PAGE;

    this._allFilmPresenter = {};
    this._topFilmPresenter = {};
    this._mostFilmPresenter = {};

    this._allFilmsListIds = [];
    this._topFilmsListIds = [];
    this._mostFilmsListIds = [];

    this._filmsGrid = new FilmsGrid();
    this._sortComponent = new SortView();
    this._allFilmsList = new FilmListView(false, 'all-list', 'All movies. Upcoming', true);
    this._topFilmTemplate = new FilmListView(true, 'top-list', 'Top rated');
    this._mostFilmTemplate = new FilmListView(true, 'most-com-list', 'Most commented');
    this._loadMoreButton = new MoreButtonView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleMoreButtonClick = this._handleMoreButtonClick.bind(this);
  }

  init(films) {
    this._films = films.slice();

    render(this._mainContainer, this._filmsGrid, RenderPosition.BEFOREEND);

    this._renderSort();
    this._renderAllFilms();
    this._renderTopFilms();
    this._renderMostFilms();
  }

  _renderSort() {
    render(this._filmsGrid, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderFilmCard(film, insertContainer) {
    const filmCardPresenter = new FilmCardPresenter(this._handleFilmChange);
    filmCardPresenter.init(film, insertContainer);

    if (this._allFilmsListIds.includes(film.id)) {
      this._allFilmPresenter[film.id] = filmCardPresenter;
    }

    if (this._topFilmsListIds.includes(film.id)) {
      this._topFilmPresenter[film.id] = filmCardPresenter;
    }

    if (this._mostFilmsListIds.includes(film.id)) {
      this._mostFilmPresenter[film.id] = filmCardPresenter;
    }
  }

  _renderFilmsCards(filmListIds, insertContainer) {
    const filmsContainer = insertContainer.getElement().querySelector('.films-list__container');
    filmListIds.forEach((id) => this._renderFilmCard(this._films.find((film) => film.id === id), filmsContainer));
  }

  _renderAllFilms() {
    render(this._filmsGrid, this._allFilmsList, RenderPosition.BEFOREEND);

    this._allFilmsListIds = this._films
      .slice(0, Math.min(this._films.length, COUNT_FILMS_PER_PAGE))
      .map((film) => film.id);

    this._renderFilmsCards(this._allFilmsListIds, this._allFilmsList);

    if (this._films.length > COUNT_FILMS_PER_PAGE) {
      this._renderMoreButton();
    }
  }

  _renderTopFilms() {
    render(this._filmsGrid, this._topFilmTemplate, RenderPosition.BEFOREEND);

    this._topFilmsListIds = this._films
      .sort((a, b) => b.rating - a.rating )
      .slice(0, Math.min(this._films.length, COUNT_FILMS_EXTRA_LIST))
      .map((film) => film.id);

    this._renderFilmsCards(this._topFilmsListIds, this._topFilmTemplate);
  }

  _renderMostFilms() {
    render(this._filmsGrid, this._mostFilmTemplate, RenderPosition.BEFOREEND);

    this._mostFilmsListIds = this._films
      .sort((a, b) => b.comments.length - a.comments.length )
      .slice(0, Math.min(this._films.length, COUNT_FILMS_EXTRA_LIST))
      .map((film) => film.id);

    this._renderFilmsCards(this._mostFilmsListIds, this._mostFilmTemplate);
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);

    if (this._allFilmsListIds.includes(updatedFilm.id)) {
      this._allFilmPresenter[updatedFilm.id].init(updatedFilm, this._allFilmsList.getElement().querySelector('.films-list__container'));
    }

    if (this._topFilmsListIds.includes(updatedFilm.id)) {
      this._topFilmPresenter[updatedFilm.id].init(updatedFilm, this._topFilmTemplate.getElement().querySelector('.films-list__container'));
    }

    if (this._mostFilmsListIds.includes(updatedFilm.id)) {
      this._mostFilmPresenter[updatedFilm.id].init(updatedFilm, this._mostFilmTemplate.getElement().querySelector('.films-list__container'));
    }
  }

  _handleMoreButtonClick() {
    this._renderFilmsCards(this._renderFilmCount, Math.min(this._films.length, this._renderFilmCount + COUNT_FILMS_PER_PAGE), this._allFilmsList);

    this._renderFilmCount += COUNT_FILMS_PER_PAGE;

    if (this._renderFilmCount >= this._films.length) {
      remove(this._loadMoreButton);
    }
  }

  _renderMoreButton() {
    render(this._allFilmsList, this._loadMoreButton, RenderPosition.BEFOREEND);

    this._loadMoreButton.setClickHandler(this._handleMoreButtonClick);
  }
}
