import FilmCardView from '../view/film-card';
import FilmDetails from '../view/film-details';
import {render, remove, RenderPosition, replace} from '../utils/render';

export default class FilmCard {
  constructor(insertContainer) {
    this._insertContainer = insertContainer;

    this._filmCard = null;
    this._filmDetailsModal = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(film) {
    const prevFilmCard = this._filmCard;
    const prevFilmDetailsModal = this._filmDetailsModal;

    this._filmCard = new FilmCardView(film);
    this._filmDetailsModal = new FilmDetails(film);

    if (prevFilmCard === null || prevFilmDetailsModal === null) {
      this._renderFilmCard();
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

  _renderFilmCard() {
    render(this._insertContainer, this._filmCard, RenderPosition.BEFOREEND);

    this._filmCard.setClickHandler(this._handleFilmCardClick);
  }

  _showDetailsFilm() {
    /*const openedDetailsFilm = document.querySelector('.film-details');
    if (openedDetailsFilm) {
      return;
    }*/

    document.body.classList.add('hide-overflow');
    render(document.body, this._filmDetailsModal, RenderPosition.BEFOREEND);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._filmDetailsModal.closeDerailFilm();
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _handleFilmCardClick() {
    this._showDetailsFilm();
    document.addEventListener('keydown', this._escKeyDownHandler);

    this._filmDetailsModal.setCloseBtnHandler(() => {
      document.removeEventListener('keydown', this._escKeyDownHandler);
    });
  }
}
