import FilmCardView from '../view/film-card';
import FilmDetails from '../view/film-details';
import {render, remove, RenderPosition, replace} from '../utils/render';
import {NavigationType, UpdateType, UserAction, END_POINT, AUTHORIZATION, STORE_NAME} from '../const';
import Api from '../api/api';
import Store from '../api/store';
import Provider from '../api/provider';

export default class FilmCard {
  constructor(changeData, newOpenCardModal, commentsModel, navigationModel, insertContainer) {
    this._insertContainer = insertContainer;
    this._changeData = changeData;
    this._newOpenCardModal = newOpenCardModal;
    this._commentsModel = commentsModel;
    this._navigationModel = navigationModel;

    this._filmCard = null;
    this._filmDetailsModal = null;
    this._openedFilmDetailsModal = false;

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._handleAddComments = this._handleAddComments.bind(this);
    this._handleRemoveComments = this._handleRemoveComments.bind(this);

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFilmDetailFilmClose = this._handleFilmDetailFilmClose.bind(this);
  }

  init(filmData) {
    const prevFilmCard = this._filmCard;

    this._filmData = filmData;
    this._filmCard = new FilmCardView(filmData);

    this._setHandlersFilmCard();

    if (prevFilmCard === null) {
      return;
    }

    if (this._insertContainer.contains(prevFilmCard.getElement())) {
      replace(this._filmCard, prevFilmCard);
    }

    remove(prevFilmCard);
  }

  get filmId() {
    return this._filmData.id;
  }

  get openedFilmDetailsModal() {
    return this._openedFilmDetailsModal;
  }

  _setHandlersFilmCard() {
    this._filmCard.setClickCardHandler(this._handleFilmCardClick);
    this._filmCard.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCard.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCard.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _setHandlersForDetailsModal() {
    this._filmDetailsModal.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmDetailsModal.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsModal.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmDetailsModal.setCloseBtnHandler(this._handleFilmDetailFilmClose);
    this._filmDetailsModal.setAddCommentHandler(this._handleAddComments);
    this._filmDetailsModal.setRemoveCommentHandler(this._handleRemoveComments);
  }

  _updateData(update) {
    this._filmData = Object.assign(
      {},
      this._filmData,
      update,
    );
  }

  _showDetailsFilm() {
    const api = new Api(END_POINT, AUTHORIZATION);
    const store = new Store(STORE_NAME, window.localStorage);
    const apiWithProvider = new Provider(api, store);

    apiWithProvider.getFilmComments(this._filmData.id)
      .then((comments) => {
        this._commentsModel.setFilmComments(comments);
        this._commentsData = this._commentsModel.getFilmComments();
      })
      .catch(() => {
        this._commentsModel.setFilmComments([]);
      })
      .then(() => {
        this._newOpenCardModal();
        this._filmDetailsModal = new FilmDetails(this._filmData, this._commentsData);
        this._setHandlersForDetailsModal();
        this._openedFilmDetailsModal = true;
        document.body.classList.add('hide-overflow');
        render(document.body, this._filmDetailsModal, RenderPosition.BEFOREEND);
        this._filmDetailsModal.setCloseBtnHandler(this._handleFilmDetailFilmClose);
      });
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.closeDetailsFilm();
    }
  }

  _handleFilmCardClick() {
    this._showDetailsFilm();

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFilmDetailFilmClose() {
    this.closeDetailsFilm();
  }

  _handleAddComments(comment) {
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH_COMMENTS_LIST,
      {filmDetailsModal: this._filmDetailsModal, filmId: this.filmId, newComment: comment},
    );
  }

  _handleRemoveComments(delCommentId) {
    this._changeData(
      UserAction.REMOVE_COMMENT,
      UpdateType.PATCH_COMMENTS_LIST,
      {filmDetailsModal: this._filmDetailsModal, filmId: this.filmId, delCommentId: delCommentId},
    );
  }

  _handleWatchlistClick() {
    this._updateData({inWatchlist: !this._filmData.inWatchlist});

    this._changeData(
      UserAction.UPDATE_FILM,
      this._navigationModel.getNavItem() === NavigationType.WATCHLIST ? UpdateType.MINOR : UpdateType.PATCH,
      this._filmData,
    );
  }

  _handleWatchedClick() {
    this._updateData({
      isWatched: !this._filmData.isWatched,
      watchedDate: new Date(),
    });

    this._changeData(
      UserAction.UPDATE_FILM,
      this._navigationModel.getNavItem() === NavigationType.WATCHED ? UpdateType.MINOR : UpdateType.PATCH,
      this._filmData,
    );
  }

  _handleFavoriteClick() {
    this._updateData({isFavorite: !this._filmData.isFavorite});

    this._changeData(
      UserAction.UPDATE_FILM,
      this._navigationModel.getNavItem() === NavigationType.FAVORITES ? UpdateType.MINOR : UpdateType.PATCH,
      this._filmData,
    );
  }

  renderFilmCard() {
    render(this._insertContainer, this._filmCard, RenderPosition.BEFOREEND);
  }

  closeDetailsFilm() {
    this._openedFilmDetailsModal = false;
    remove(this._filmDetailsModal);

    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    remove(this._filmCard);
  }
}
