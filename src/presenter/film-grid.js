import {remove, render, RenderPosition} from '../utils/render';
import {updateItem} from '../utils/common';

import FilmListView from '../view/film-list';
import SortView from '../view/sort';
import FilmsGrid from '../view/films-grid';
import MoreButtonView from '../view/show-more-btn';

import FilmCardPresenter from '../presenter/film-card';
import {SortType} from '../const';
import {sortFilmsDate, sortFilmsRating} from '../utils/film-helper';

const COUNT_FILMS_PER_PAGE = 5;
const COUNT_FILMS_EXTRA_LIST = 2;

export default class FilmGrid {
  constructor(mainContainer, filmsModel) {
    this._mainContainer = mainContainer;
    this._renderFilmsCount = COUNT_FILMS_PER_PAGE;

    this._filmsModel = filmsModel;

    this._allFilmPresenters = [];
    this._topRatedFilmPresenters = [];
    this._mostCommentsFilmPresenters = [];

    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._filmsGrid = new FilmsGrid();
    this._allFilmsList = new FilmListView(false, 'all-list', 'All movies. Upcoming', true);
    this._topFilmTemplate = new FilmListView(true, 'top-list', 'Top rated');
    this._mostFilmTemplate = new FilmListView(true, 'most-com-list', 'Most commented');
    this._loadMoreButton = new MoreButtonView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleNewOpenCardModal = this._handleNewOpenCardModal.bind(this);
    this._handleMoreButtonClick = this._handleMoreButtonClick.bind(this);

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    // 1. В отличии от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив:
    this._sourcedFilmGrid = films.slice();

    render(this._mainContainer, this._filmsGrid, RenderPosition.BEFOREEND);

    this._renderSort();

    this._renderAllFilms();
    this._renderTopRatedFilms();
    this._renderMostCommentsFilms();
  }

  _getFilms() {
    // switch (this._currentShowList) {
    //   case ShowList.WATCHLIST:
    //     return this._filmsModel.getFilms().filter((film) => film.inWatchlist);
    //   case ShowList.WATCHED:
    //     return this._filmsModel.getFilms().filter((film) => film.isWatched);
    //   case ShowList.FAVORITE:
    //     return this._filmsModel.getFilms().filter((film) => film.isFavorite);
    // }

    return this._filmsModel.getFilms();
  }

  _fillPresenterList(presenterList, filmsContainer, sort) {
    const insertContainer = filmsContainer.getElement().querySelector('.films-list__container');

    let allFilms = this._films;

    if (sort) {
      allFilms = sort === 'comments'
        ? allFilms.sort((a, b) => b[sort].length - a[sort].length)
        : allFilms.sort((a, b) => b[sort] - a[sort]);
      allFilms.slice(0, Math.min(this._films.length, COUNT_FILMS_EXTRA_LIST));
    }

    allFilms.map((film) => {
      const presenter = new FilmCardPresenter(this._handleFilmChange, this._handleNewOpenCardModal, insertContainer);
      presenter.init(film);

      presenterList.push(presenter);
    });
  }

  _renderSort() {
    render(this._filmsGrid, this._sortComponent, RenderPosition.BEFOREBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilmsCards(presenterList, from, to) {
    presenterList
      .slice(from, to)
      .forEach((presenter) => presenter.renderFilmCard());
  }

  _renderAllFilms() {
    render(this._filmsGrid, this._allFilmsList, RenderPosition.AFTERBEGIN);

    if (!this._allFilmPresenters.length) {
      this._fillPresenterList(this._allFilmPresenters, this._allFilmsList);
    }
    this._renderFilmsCards(this._allFilmPresenters, 0, Math.min(this._films.length, this._renderFilmsCount));

    if (this._films.length > COUNT_FILMS_PER_PAGE) {
      this._renderMoreButton();
    }
  }

  _renderTopRatedFilms() {
    render(this._filmsGrid, this._topFilmTemplate, RenderPosition.BEFOREEND);

    if (!this._topRatedFilmPresenters.length) {
      this._fillPresenterList(this._topRatedFilmPresenters, this._topFilmTemplate, 'rating');
    }

    this._renderFilmsCards(this._topRatedFilmPresenters, 0, Math.min(this._films.length, COUNT_FILMS_EXTRA_LIST));
  }

  _renderMostCommentsFilms() {
    render(this._filmsGrid, this._mostFilmTemplate, RenderPosition.BEFOREEND);

    if (!this._mostCommentsFilmPresenters.length) {
      this._fillPresenterList(this._mostCommentsFilmPresenters, this._mostFilmTemplate, 'comments');
    }

    this._renderFilmsCards(this._mostCommentsFilmPresenters, 0, Math.min(this._films.length, COUNT_FILMS_EXTRA_LIST));
  }

  _clearFilmsCards() {
    this._allFilmPresenters.forEach((presenter) => presenter.destroy());
    this._allFilmPresenters = [];
    this._renderFilmsCount = COUNT_FILMS_PER_PAGE;
    remove(this._allFilmsList);
    remove(this._loadMoreButton);
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilmGrid = updateItem(this._sourcedFilmGrid, updatedFilm);

    this._allFilmPresenters.find((presenter) => presenter.filmId === updatedFilm.id).init(updatedFilm);
    this._topRatedFilmPresenters.find((presenter) => presenter.filmId === updatedFilm.id).init(updatedFilm);
    this._mostCommentsFilmPresenters.find((presenter) => presenter.filmId === updatedFilm.id).init(updatedFilm);
  }

  _sortTasks(sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortFilmsDate);
        break;
      case SortType.RATING:
        this._films.sort(sortFilmsRating);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this._films = this._sourcedFilmGrid.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    // - Сортируем задачи
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTasks(sortType);
    // - Очищаем список
    this._clearFilmsCards();
    // - Рендерим список заново
    this._renderAllFilms();
  }

  _handleNewOpenCardModal() {
    const isOpenedFilmCard = this._allFilmPresenters.find((presenter) => presenter.openedFilmDetailsModal)
      || this._topRatedFilmPresenters.find((presenter) => presenter.openedFilmDetailsModal)
      || this._mostCommentsFilmPresenters.find((presenter) => presenter.openedFilmDetailsModal);

    if (isOpenedFilmCard) {
      isOpenedFilmCard.closeDetailsFilm();
    }
  }

  _handleMoreButtonClick() {
    this._renderFilmsCards(this._allFilmPresenters, this._renderFilmsCount, Math.min(this._films.length, this._renderFilmsCount + COUNT_FILMS_PER_PAGE));

    this._renderFilmsCount += COUNT_FILMS_PER_PAGE;

    if (this._renderFilmsCount >= this._films.length) {
      remove(this._loadMoreButton);
    }
  }

  _renderMoreButton() {
    render(this._allFilmsList, this._loadMoreButton, RenderPosition.BEFOREEND);

    this._loadMoreButton.setClickHandler(this._handleMoreButtonClick);
  }
}
