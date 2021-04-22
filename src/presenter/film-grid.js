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
    this._filmPresenter = {};

    this._filmsGrid = new FilmsGrid();
    this._sortComponent = new SortView();
    this._allFilmsList = new FilmListView(false, 'all-list', 'All movies. Upcoming', true);
    this._topFilmTemplate = new FilmListView(true, 'top-list', 'Top rated');
    this._mostFilmTemplate = new FilmListView(true, 'most-com-list', 'Most commented');
    this._loadMoreButton = new MoreButtonView();

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
    const filmCardPresenter = new FilmCardPresenter(insertContainer);
    filmCardPresenter.init(film);
    this._filmPresenter[film.id] = filmCardPresenter;
  }

  _renderFilmsCards(from, to, insertContainer) {
    const filmsContainer = insertContainer.getElement().querySelector('.films-list__container');
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(film, filmsContainer));
  }

  _renderAllFilms() {
    render(this._filmsGrid, this._allFilmsList, RenderPosition.BEFOREEND);
    this._renderFilmsCards(0, Math.min(this._films.length, COUNT_FILMS_PER_PAGE), this._allFilmsList);

    if (this._films.length > COUNT_FILMS_PER_PAGE) {
      this._renderMoreButton();
    }
  }

  _renderTopFilms() {
    render(this._filmsGrid, this._topFilmTemplate, RenderPosition.BEFOREEND);
    this._renderFilmsCards(0, Math.min(this._films.length, COUNT_FILMS_EXTRA_LIST), this._topFilmTemplate);
  }

  _renderMostFilms() {
    render(this._filmsGrid, this._mostFilmTemplate, RenderPosition.BEFOREEND);
    this._renderFilmsCards(0, Math.min(this._films.length, COUNT_FILMS_EXTRA_LIST), this._mostFilmTemplate);
  }

  _handleFilmChange(updatedFilm) {
    this._boardTasks = updateItem(this._boardTasks, updatedFilm);
    this._taskPresenter[updatedFilm.id].init(updatedFilm);
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
