import {remove, render, RenderPosition} from '../utils/render';

import FilmListView from '../view/film-list';
import SortView from '../view/sort';
import FilmsGrid from '../view/films-grid';
import MoreButtonView from '../view/show-more-btn';

import FilmCardPresenter from '../presenter/film-card';
import {SortType, UserAction, UpdateType} from '../const';
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

    this._sortComponent = null;
    this._loadMoreButton = null;

    this._filmsGrid = new FilmsGrid();
    this._allFilmsList = new FilmListView(false, 'all-list', 'All movies. Upcoming', true);
    this._topFilmTemplate = new FilmListView(true, 'top-list', 'Top rated');
    this._mostFilmTemplate = new FilmListView(true, 'most-com-list', 'Most commented');

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleNewOpenCardModal = this._handleNewOpenCardModal.bind(this);
    this._handleMoreButtonClick = this._handleMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._mainContainer, this._filmsGrid, RenderPosition.BEFOREEND);

    this._renderFilmsGrid();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms().slice().sort(sortFilmsDate);
      case SortType.RATING:
        return this._filmsModel.getFilms().slice().sort(sortFilmsRating);
    }

    return this._filmsModel.getFilms();
  }

  get _countFilms() {
    return this._getFilms().length;
  }

  _renderFilmsGrid() {
    if (this._countFilms === 0) {
      //рендер заглушки
      // this._renderNoTasks();
      return;
    }

    this._renderSort();

    this._renderAllFilms();
    this._renderTopRatedFilms();
    this._renderMostCommentsFilms();
  }

  _fillPresenterList(presenterList, filmsContainer, sort) {
    const insertContainer = filmsContainer.getElement().querySelector('.films-list__container');
    let allFilms = this._getFilms().slice();

    if (sort) {
      allFilms = sort === 'comments'
        ? allFilms.sort((a, b) => b[sort].length - a[sort].length)
        : allFilms.sort((a, b) => b[sort] - a[sort]);
      allFilms.slice(0, Math.min(this._countFilms, COUNT_FILMS_EXTRA_LIST));
    }

    allFilms.map((film) => {
      const presenter = new FilmCardPresenter(this._handleViewAction, this._handleNewOpenCardModal, insertContainer);
      presenter.init(film);

      presenterList.push(presenter);
    });
  }

  _updateFoundPresenter(data) {
    this._allFilmPresenters.find((presenter) => presenter.filmId === data.id).init(data);
    this._topRatedFilmPresenters.find((presenter) => presenter.filmId === data.id).init(data);
    this._mostCommentsFilmPresenters.find((presenter) => presenter.filmId === data.id).init(data);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmsGrid, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderFilmsCards(presenterList, films) {
    films.forEach((film) => {
      const filmPresenter = presenterList.find((presenter) => presenter.filmId === film.id);
      filmPresenter.renderFilmCard();
    });
  }

  _renderAllFilms() {
    render(this._filmsGrid, this._allFilmsList, RenderPosition.AFTERBEGIN);

    const films = this._getFilms().slice(0, Math.min(this._countFilms, COUNT_FILMS_PER_PAGE));

    if (!this._allFilmPresenters.length) {
      this._fillPresenterList(this._allFilmPresenters, this._allFilmsList);
    }

    this._renderFilmsCards(this._allFilmPresenters, films);

    if (this._countFilms > COUNT_FILMS_PER_PAGE) {
      this._renderMoreButton();
    }
  }

  _renderTopRatedFilms() {
    render(this._filmsGrid, this._topFilmTemplate, RenderPosition.BEFOREEND);

    const films = this._getFilms()
      .slice()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, Math.min(this._countFilms, COUNT_FILMS_EXTRA_LIST));

    if (!this._topRatedFilmPresenters.length) {
      this._fillPresenterList(this._topRatedFilmPresenters, this._topFilmTemplate, 'rating');
    }

    this._renderFilmsCards(this._topRatedFilmPresenters, films);
  }

  _renderMostCommentsFilms() {
    render(this._filmsGrid, this._mostFilmTemplate, RenderPosition.BEFOREEND);

    const films = this._getFilms()
      .slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, Math.min(this._countFilms, COUNT_FILMS_EXTRA_LIST));

    if (!this._mostCommentsFilmPresenters.length) {
      this._fillPresenterList(this._mostCommentsFilmPresenters, this._mostFilmTemplate, 'comments');
    }

    this._renderFilmsCards(this._mostCommentsFilmPresenters, films);
  }

  _clearFilmsGrid({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    this._allFilmPresenters.forEach((presenter) => presenter.destroy());
    this._allFilmPresenters = [];

    remove(this._sortComponent);
    // remove(this._noTaskComponent);
    remove(this._loadMoreButton);

    if (resetRenderedFilmCount) {
      this._renderFilmsCount = COUNT_FILMS_PER_PAGE;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this._renderFilmsCount = Math.min(this._countFilms, this._renderFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    console.log('_handleViewAction', actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    if (actionType === UserAction.UPDATE_FILM) {
      this._filmsModel.updateFilmCard(updateType, update);
    }
  }

  _handleModelEvent(updateType, data) {
    console.log('_handleModelEvent', updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._updateFoundPresenter(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this._clearFilmsGrid();
        this._renderSort();
        this._renderAllFilms();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this._clearFilmsGrid({resetRenderedFilmCount: true, resetSortType: true});
        this._renderSort();
        this._renderAllFilms();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    // - Сортируем задачи
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    // - Очищаем список
    this._clearFilmsGrid({resetRenderedFilmCount: true});
    this._renderSort();
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
    const newRenderedFilmCount = Math.min(this._countFilms, this._renderFilmsCount + COUNT_FILMS_PER_PAGE);
    const films = this._getFilms().slice(this._renderFilmsCount, newRenderedFilmCount);
    this._renderFilmsCards(this._allFilmPresenters, films);
    this._renderFilmsCount = newRenderedFilmCount;

    if (this._renderFilmsCount >= this._countFilms) {
      remove(this._loadMoreButton);
    }
  }

  _renderMoreButton() {
    if (this._loadMoreButton !== null) {
      this._loadMoreButton = null;
    }

    this._loadMoreButton = new MoreButtonView();

    this._loadMoreButton.setClickHandler(this._handleMoreButtonClick);

    render(this._allFilmsList, this._loadMoreButton, RenderPosition.BEFOREEND);
  }
}
