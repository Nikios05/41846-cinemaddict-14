import {remove, render, RenderPosition, replace} from '../utils/render';
import {SortType, UserAction, UpdateType, NavigationType, COUNT_FILMS_PER_PAGE, COUNT_FILMS_EXTRA_LIST} from '../const';
import {sortFilmsDate, sortFilmsRating} from '../utils/film-helper';
import {NavItem} from '../utils/navigation';

import FilmListView from '../view/film-list';
import ProfileView from '../view/profile';
import SortView from '../view/sort';
import FilmsGrid from '../view/films-grid';
import StatisticsView from '../view/statistics';
import MoreButtonView from '../view/more-btn';
import LoadingView from '../view/loading.js';
import NoFilmsPlaceholder from '../view/no-films-placeholder';

import FilmCardPresenter from '../presenter/film-card';
import {isOnline} from '../utils/common';
import {toast} from '../utils/toast';

export default class FilmGrid {
  constructor(mainContainer, headerContainer, filmsModel, commentsModel, navigationModel, api) {
    this._headerContainer = headerContainer;
    this._mainContainer = mainContainer;
    this._renderFilmsCount = COUNT_FILMS_PER_PAGE;

    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._navigationModel = navigationModel;

    this._allFilmPresenters = [];
    this._topRatedFilmPresenters = [];
    this._mostCommentsFilmPresenters = [];

    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._api = api;

    this._profileComponent = null;
    this._sortComponent = null;
    this._loadMoreButton = null;
    this._statsComponent = null;

    this._filmsGrid = new FilmsGrid();
    this._allFilmsList = new FilmListView(false, 'all-list', 'All movies. Upcoming', true);
    this._topFilmTemplate = new FilmListView(true, 'top-list', 'Top rated');
    this._mostFilmTemplate = new FilmListView(true, 'most-com-list', 'Most commented');
    this._loadingComponent = new LoadingView();
    this._noFilmsComponent = new NoFilmsPlaceholder();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleNewOpenCardModal = this._handleNewOpenCardModal.bind(this);
    this._handleMoreButtonClick = this._handleMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    render(this._mainContainer, this._filmsGrid, RenderPosition.BEFOREEND);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._navigationModel.addObserver(this._handleModelEvent);

    this._renderFilmsGrid();
  }

  _getFilms() {
    const navigationType = this._navigationModel.getNavItem();
    const films = this._filmsModel.getFilms();
    const filteredFilms = NavItem[navigationType](films).slice();

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmsRating);
      default:
        return filteredFilms;
    }
  }

  get _countFilms() {
    return this._getFilms().length;
  }

  _renderFilmsGrid() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._countFilms === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderProfile();
    this._renderSort();

    this._renderAllFilms();

    if (this._filmsModel.getFilms().some((film) => film.rating > 0)) {
      this._renderTopRatedFilms();
    }

    if (this._filmsModel.getFilms().some((film) => film.comments.length > 0)) {
      this._renderMostCommentsFilms();
    }
  }


  _renderStats() {
    const prevStats = this._statsComponent;
    this._statsComponent = new StatisticsView(this._filmsModel.getFilms().filter((film) => film.isWatched));
    if (prevStats) {
      replace(this._statsComponent, prevStats);
    } else {
      render(this._mainContainer, this._statsComponent, RenderPosition.BEFOREEND);
    }
  }

  _fillPresenterList(presenterList, filmsContainer, sort) {
    const insertContainer = filmsContainer.getElement().querySelector('.films-list__container');
    let allFilms = this._filmsModel.getFilms().slice();

    if (sort) {
      allFilms = sort === 'comments'
        ? allFilms.sort((a, b) => b[sort].length - a[sort].length)
        : allFilms.sort((a, b) => b[sort] - a[sort]);
      allFilms.slice(0, Math.min(this._countFilms, COUNT_FILMS_EXTRA_LIST));
    }

    allFilms.map((film) => {
      const presenter = new FilmCardPresenter(this._handleViewAction, this._handleNewOpenCardModal, this._commentsModel, this._navigationModel, insertContainer);
      presenter.init(film);

      presenterList.push(presenter);
    });
  }

  _updateFoundPresenter(data) {
    if (this._allFilmPresenters.length) {
      this._allFilmPresenters.find((presenter) => presenter.filmId === data.id).init(data);
    }
    this._topRatedFilmPresenters.find((presenter) => presenter.filmId === data.id).init(data);
    this._mostCommentsFilmPresenters.find((presenter) => presenter.filmId === data.id).init(data);
  }

  _renderProfile() {
    if (this._profileComponent !== null) {
      remove(this._profileComponent);
      this._profileComponent = null;
    }

    this._profileComponent = new ProfileView(this._filmsModel.getFilms().filter((film) => film.isWatched));
    render(this._headerContainer, this._profileComponent, RenderPosition.BEFOREEND);
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

    const films = this._filmsModel.getFilms()
      .slice()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, COUNT_FILMS_EXTRA_LIST);

    if (!this._topRatedFilmPresenters.length) {
      this._fillPresenterList(this._topRatedFilmPresenters, this._topFilmTemplate, 'rating');
    }

    this._renderFilmsCards(this._topRatedFilmPresenters, films);
  }

  _renderMostCommentsFilms() {
    render(this._filmsGrid, this._mostFilmTemplate, RenderPosition.BEFOREEND);

    const films = this._filmsModel.getFilms()
      .slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, COUNT_FILMS_EXTRA_LIST);

    if (!this._mostCommentsFilmPresenters.length) {
      this._fillPresenterList(this._mostCommentsFilmPresenters, this._mostFilmTemplate, 'comments');
    }

    this._renderFilmsCards(this._mostCommentsFilmPresenters, films);
  }

  _clearFilmsGrid({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    this._allFilmPresenters.forEach((presenter) => presenter.destroy());
    this._allFilmPresenters = [];

    remove(this._sortComponent);
    remove(this._noFilmsComponent);
    remove(this._loadMoreButton);
    remove(this._loadingComponent);

    if (resetRenderedFilmCount) {
      this._renderFilmsCount = COUNT_FILMS_PER_PAGE;
    } else {
      this._renderFilmsCount = Math.min(this._countFilms, this._renderFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _clearCommentsFilmsList() {
    this._mostCommentsFilmPresenters.forEach((presenter) => presenter.destroy());
    this._mostCommentsFilmPresenters = [];
  }

  _handleViewAction(actionType, updateType, update) {
    let updatedFilm;
    if (update.filmId) {
      updatedFilm = this._filmsModel.getFilms().find((film) => film.id === update.filmId);
    }
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilmCard(updateType, response);
        });
        break;
      case UserAction.ADD_COMMENT:
        if (!isOnline()) {
          toast('You can\'t create new comment offline');
          update.filmDetailsModal.restoreDefaultState(true);
          break;
        }
        this._api.addComment(updatedFilm, update.newComment)
          .then((comments) => {
            this._commentsModel.updateComments(comments);
            this._filmsModel.updateFilmComments(updateType, updatedFilm, comments);
            update.filmDetailsModal.updateDetailFilmModal(comments);
          })
          .catch(() => {
            update.filmDetailsModal.restoreDefaultState(true);
          });
        break;
      case UserAction.REMOVE_COMMENT:
        if (!isOnline()) {
          toast('You can\'t remove comment offline');
          update.filmDetailsModal.restoreDefaultState(true);
          break;
        }
        this._api.removeComment(update.delCommentId)
          .then(() => {
            this._commentsModel.removeComment(update.delCommentId);
            this._filmsModel.updateFilmComments(updateType, updatedFilm, this._commentsModel.getFilmComments());
            update.filmDetailsModal.updateDetailFilmModal(this._commentsModel.getFilmComments());
          })
          .catch(() => {
            update.filmDetailsModal.restoreDefaultState();
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка
        this._updateFoundPresenter(data);
        this._renderProfile();
        break;
      case UpdateType.PATCH_COMMENTS_LIST:
        // - обновить часть списка и грид с наибольшими комментариями
        this._updateFoundPresenter(data);
        this._clearCommentsFilmsList();
        this._renderMostCommentsFilms();
        break;
      case UpdateType.MINOR:
        // - обновить список
        this._clearFilmsGrid();
        this._updatedPageComponent();
        break;
      case UpdateType.MAJOR:
        // - обновить весь грид
        this._clearFilmsGrid({resetRenderedFilmCount: true, resetSortType: true});
        if (data === NavigationType.STATS) {
          this._renderStats();
          this._filmsGrid.hide();
        } else {
          if (this._statsComponent) {
            this._statsComponent.hide();
          }
          this._filmsGrid.show();
          this._updatedPageComponent();
        }
        break;
      case UpdateType.INIT:
        // - обновление при инициализации с сервера
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmsGrid();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsGrid({resetRenderedFilmCount: true});
    this._renderSort();
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
      remove(this._loadMoreButton);
      this._loadMoreButton = null;
    }

    this._loadMoreButton = new MoreButtonView();

    this._loadMoreButton.setClickHandler(this._handleMoreButtonClick);

    render(this._allFilmsList, this._loadMoreButton, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    render(this._filmsGrid, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoFilms() {
    render(this._filmsGrid, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _updatedPageComponent() {
    this._renderProfile();
    if (this._getFilms().length) {
      this._renderSort();
      this._renderAllFilms();
    } else {
      this._renderNoFilms();
    }
  }

  destroy() {
    this._clearFilmsGrid({resetRenderedTaskCount: true, resetSortType: true});

    remove(this._allFilmsList);
    remove(this._topFilmTemplate);
    remove(this._mostFilmTemplate);
    remove(this._filmsGrid);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._commentsModel.removeObserver(this._handleModelEvent);
    this._navigationModel.removeObserver(this._handleModelEvent);
  }
}
