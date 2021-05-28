import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilmCard(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  updateFilmComments(updateType, updateFilm, newComments) {
    const updatedFilm = Object.assign(
      {},
      this._films.find((film) => film.id === updateFilm.id),
      {
        comments: newComments,
      },
    );
    this.updateFilmCard(updateType, updatedFilm);
  }

  static adaptToClient(film) {
    const filmInfo = film['film_info'];
    const filmUserDetails = film['user_details'];
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        posterUrl: filmInfo.poster,
        filmName: filmInfo.title,
        originFilmName: filmInfo['alternative_title'],
        rating: filmInfo['total_rating'],
        releaseDate: new Date(filmInfo.release.date),
        country: filmInfo.release['release_country'],
        duration: filmInfo.runtime,
        filmGenres: filmInfo.genre,
        description: filmInfo.description,
        director: filmInfo.director,
        screenwriters: filmInfo.writers,
        cast: filmInfo.actors,
        ageRating: filmInfo['age_rating'],
        inWatchlist: filmUserDetails.watchlist,
        isWatched: filmUserDetails['already_watched'],
        watchedDate: new Date(filmUserDetails['watching_date']),
        isFavorite: filmUserDetails.favorite,
      },
    );

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'film_info' : {
          'actors' : film.cast,
          'age_rating' : film.ageRating,
          'alternative_title' : film.originFilmName,
          'description' : film.description,
          'director' : film.director,
          'genre' : film.filmGenres,
          'poster' : film.posterUrl,
          'release' : {
            'date' : film.releaseDate instanceof Date ? film.releaseDate.toISOString() : null,
            'release_country' : film.country,
          },
          'runtime' : film.duration,
          'title' : film.filmName,
          'total_rating' : film.rating,
          'writers' : film.screenwriters,
        },
        'user_details' : {
          'already_watched' : film.isWatched,
          'favorite' : film.isFavorite,
          'watching_date' : film.watchedDate instanceof Date ? film.watchedDate.toISOString() : null,
          'watchlist' : film.inWatchlist,
        },
      },
    );

    delete adaptedFilm.posterUrl;
    delete adaptedFilm.filmName;
    delete adaptedFilm.originFilmName;
    delete adaptedFilm.rating;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.country;
    delete adaptedFilm.duration;
    delete adaptedFilm.filmGenres;
    delete adaptedFilm.description;
    delete adaptedFilm.director;
    delete adaptedFilm.screenwriters;
    delete adaptedFilm.cast;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.inWatchlist;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.watchedDate;
    delete adaptedFilm.isFavorite;

    return adaptedFilm;
  }
}
