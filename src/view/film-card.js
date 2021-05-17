import {shortenText} from '../utils/film-helper';
import AbstractView from './abstract-view';

const createFilmCard = (film) => {
  return `
    <article class="film-card">
      <h3 class="film-card__title">${film.filmName}</h3>
      <p class="film-card__rating">${film.rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${film.releaseDate.getFullYear()}</span>
        <span class="film-card__duration">${film.duration}</span>
        <span class="film-card__genre">${film.filmGenres[0]}</span>
      </p>
      <img src="./images/posters/${film.posterUrl}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortenText(film.description)}</p>
      <a class="film-card__comments">${film.comments.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item button
                       film-card__controls-item--add-to-watchlist
                       ${film.inWatchlist && 'film-card__controls-item--active'}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item button
                       film-card__controls-item--mark-as-watched
                       ${film.isWatched && 'film-card__controls-item--active'}" type="button">Mark as watched</button>
        <button class="film-card__controls-item button
                       film-card__controls-item--favorite
                       ${film.isFavorite && 'film-card__controls-item--active'}" type="button">Mark as favorite</button>
      </div>
    </article>
  `;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();

    this._film = film;

    this._clickCardHandler = this._clickCardHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  _clickCardHandler(evt) {
    evt.preventDefault();
    this._callback.clickToOpen();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this._callback.watchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this._callback.favoriteClick();
  }

  getTemplate() {
    return createFilmCard(this._film);
  }

  setClickCardHandler(callback) {
    this._callback.clickToOpen = callback;
    this.getElement().addEventListener('click', this._clickCardHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }
}
