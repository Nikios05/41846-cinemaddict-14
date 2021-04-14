import {createElement, shortenText} from '../utils';

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

export default class FilmCard {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmCard(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
