import FilmCardView from '../view/film-card';
import FilmDetails from '../view/film-details';
import {render, remove, RenderPosition, replace} from '../utils/render';
import {UpdateType, UserAction} from '../const';

export default class FilmCard {
  constructor(changeData, newOpenCardModal, insertContainer) {
    this._insertContainer = insertContainer;
    this._changeData = changeData;
    this._newOpenCardModal = newOpenCardModal;

    this._filmCard = null;
    this._filmDetailsModal = null;
    this._openedFilmDetailsModal = false;

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFilmDetailFilmClose = this._handleFilmDetailFilmClose.bind(this);
    this._handleAddNewComment = this._handleAddNewComment.bind(this);
  }

  init(filmData) {
    const prevFilmCard = this._filmCard;

    this._filmData = filmData;
    this._filmCard = new FilmCardView(filmData);

    this._setHandlersFilmCard();

    if (prevFilmCard === null) {
      return;
    }

    // // Проверка на наличие в DOM необходима,
    // // чтобы не пытаться заменить то, что не было отрисовано
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
    this._filmDetailsModal.setUpdateCommentsHandler(this._handleAddNewComment);
  }

  _showDetailsFilm() {
    this._newOpenCardModal();

    this._filmDetailsModal = new FilmDetails(this._filmData);
    this._setHandlersForDetailsModal();
    this._openedFilmDetailsModal = true;

    document.body.classList.add('hide-overflow');
    render(document.body, this._filmDetailsModal, RenderPosition.BEFOREEND);
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

    this._filmDetailsModal.setCloseBtnHandler(this._handleFilmDetailFilmClose);
  }

  _handleFilmDetailFilmClose() {
    this.closeDetailsFilm();
  }

  _handleAddNewComment() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._filmData,
        {
          comments: this._filmData.comments,
        },
      ),
    );
  }

  _handleWatchlistClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._filmData,
        {
          inWatchlist: !this._filmData.inWatchlist,
        },
      ),
    );
  }

  _handleWatchedClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._filmData,
        {
          isWatched: !this._filmData.isWatched,
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._filmData,
        {
          isFavorite: !this._filmData.isFavorite,
        },
      ),
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
