import FilmCardView from '../view/film-card';
import FilmDetails from '../view/film-details';
import {render, remove, RenderPosition, replace} from '../utils/render';

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
  }

  init(filmData) {
    const prevFilmCard = this._filmCard;
    const prevFilmDetailsModal = this._filmDetailsModal;

    this._filmData = filmData;
    this._filmCard = new FilmCardView(filmData);
    this._filmDetailsModal = new FilmDetails(filmData);

    this._filmCard.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCard.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCard.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmDetailsModal.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmDetailsModal.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsModal.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmCard === null || prevFilmDetailsModal === null) {
      return;
    }

    // // Проверка на наличие в DOM необходима,
    // // чтобы не пытаться заменить то, что не было отрисовано
    if (this._insertContainer.contains(prevFilmCard.getElement())) {
      replace(this._filmCard, prevFilmCard);
    }

    if (document.body.contains(prevFilmDetailsModal.getElement())) {
      replace(this._filmDetailsModal, prevFilmDetailsModal);
    }

    remove(prevFilmCard);
    remove(prevFilmDetailsModal);
  }

  get filmId() {
    return this._filmData.id;
  }

  get openedFilmDetailsModal() {
    return this._openedFilmDetailsModal;
  }

  _showDetailsFilm() {
    this._newOpenCardModal();
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

    this._filmDetailsModal.setCloseBtnHandler(() => {
      this.closeDetailsFilm();
    });
  }

  _handleWatchlistClick() {
    this._changeData(
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

    this._filmCard.setClickHandler(this._handleFilmCardClick);
  }

  closeDetailsFilm() {
    this._openedFilmDetailsModal = false;

    remove(this._filmDetailsModal);

    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }
}
