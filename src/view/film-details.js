import {convertMinToTime, getFullDate, getFullCommentDate} from '../utils/film-helper';
import SmartView from './smart-view';
import {EMOTIONS, SHAKE_DURATION} from '../const';
import he from 'he';

const renderFilmGenres = (genres) => {
  return genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');
};

const renderComment = ({id, emotion, text, author, date}) => {
  return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${getFullCommentDate(date)}</span>
          <button class="film-details__comment-delete" id="${id}">Delete</button>
        </p>
      </div>
    </li>
  `;
};

const createEmotionsList = (currentEmoji) => {
  return EMOTIONS.map((emoji) => `<input
    class="film-details__emoji-item visually-hidden"
    name="comment-emoji"
    type="radio"
    id="emoji-${emoji}" value="${emoji}"
    ${currentEmoji === emoji ? 'checked' : ''}
  >
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`).join('');
};

const renderSelectEmoji = (selectEmoji) => {
  return `<img src="./images/emoji/${selectEmoji}.png" width="55" height="55" alt="emoji-${selectEmoji}">`;
};

const createFilmDetails = (film, comments) => {
  const commentsTemplate = comments.map((comment) => renderComment(comment)).join('');

  const emotionsListTemplate = createEmotionsList(film.currentCommentEmoji);

  const selectEmojiTemplate = renderSelectEmoji(film.currentCommentEmoji);

  return `
    <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${film.posterUrl}" alt="">

              <p class="film-details__age">${film.ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${film.filmName}</h3>
                  <p class="film-details__title-original">Original: ${film.originFilmName}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${film.rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${film.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${film.screenwriters.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${film.cast.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${getFullDate(film.releaseDate)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${convertMinToTime(film.duration)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${film.country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${film.filmGenres.length > 1 ? 'Genres' : 'Genre'}</td>
                  <td class="film-details__cell">
                    ${renderFilmGenres(film.filmGenres)}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${film.description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${film.inWatchlist ? 'checked' : ''}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${film.isWatched ? 'checked' : ''}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${film.isFavorite ? 'checked' : ''}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${film.comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsTemplate}
            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
                ${film.currentCommentEmoji ? selectEmojiTemplate : ''}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${film.currentCommentText ? he.encode(film.currentCommentText) : ''}</textarea>
              </label>

              <div class="film-details__emoji-list">
                ${emotionsListTemplate}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>
  `;
};

export default class FilmDetails extends SmartView {
  constructor(film, comments) {
    super();

    this._data = film;
    this._comments = comments;

    this._clickCloseHandler = this._clickCloseHandler.bind(this);
    this._watchlistToggleHandler = this._watchlistToggleHandler.bind(this);
    this._watchedToggleHandler = this._watchedToggleHandler.bind(this);
    this._favoriteToggleHandler = this._favoriteToggleHandler.bind(this);

    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._commentSendHandler = this._commentSendHandler.bind(this);
    this._emojiInputHandler = this._emojiInputHandler.bind(this);
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);

    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    const inputComment = this.getElement().querySelector('.film-details__comment-input');

    inputComment.addEventListener('keydown', this._commentSendHandler);
    inputComment.addEventListener('input', this._commentInputHandler);

    this.getElement()
      .querySelectorAll('.film-details__emoji-item').forEach((item) => {
        item.addEventListener('input', this._emojiInputHandler);
      });

    this.getElement()
      .querySelectorAll('.film-details__comment-delete').forEach((item) => {
        item.addEventListener('click', this._deleteCommentHandler);
      });
  }

  _clickCloseHandler(evt) {
    evt.preventDefault();
    this._callback.closeBtnClick();
  }

  _watchlistToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      inWatchlist: !this._data.inWatchlist,
      currentScroll: this.getElement().scrollTop,
    });

    this._callback.watchlistClick();
  }

  _watchedToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isWatched: !this._data.isWatched,
      currentScroll: this.getElement().scrollTop,
    });

    this._callback.watchedClick();
  }

  _favoriteToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite,
      currentScroll: this.getElement().scrollTop,
    });

    this._callback.favoriteClick();
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      currentCommentText: evt.target.value,
    }, true);
  }

  _emojiInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      currentCommentEmoji: evt.target.value,
      currentScroll: this.getElement().scrollTop,
    });
  }

  _commentSendHandler(evt) {
    if ((evt.metaKey || evt.ctrlKey) && evt.key === 'Enter') {

      this._blockUsersInputs();

      const newComment = this._newComment();

      this._callback.addCommentHandler(newComment);
    }
  }

  _newComment() {
    return {
      text: this._data.currentCommentText,
      emotion: this._data.currentCommentEmoji,
    };
  }

  _deleteCommentHandler(evt) {
    evt.preventDefault();
    evt.target.innerText = 'Deleting...';
    evt.target.disabled = true;
    evt.target.classList.add('film-details__comment-delete--disabled');

    this._callback.removeCommentHandler(evt.target.id);
  }

  _blockUsersInputs() {
    this.getElement().querySelector('.film-details__comment-input').disabled = true;
    this.getElement().querySelectorAll('.film-details__emoji-item').forEach((item) => {
      item.disabled = true;
    });
  }

  updateDetailFilmModal(update) {
    this._comments = update;

    this._deleteCurrentInputsData();

    this.updateData({
      comments: update,
      currentScroll: this.getElement().scrollTop,
    });
  }

  _deleteCurrentInputsData() {
    delete this._data.currentCommentText;
    delete this._data.currentCommentEmoji;
  }

  _shakeComponent(element) {
    element.classList.add('shake');
    setTimeout(() => {
      element.classList.remove('shake');
    }, SHAKE_DURATION);
  }

  restoreDefaultState(is_input = false) {
    const disabledDelBtn = this.getElement().querySelector('.film-details__comment-delete--disabled');
    const commentInput = this.getElement().querySelector('.film-details__comment-input');
    const shakingComponent = is_input ? commentInput : this.getElement();

    if (disabledDelBtn) {
      disabledDelBtn.disabled = false;
      disabledDelBtn.innerText = 'Delete';
    }

    this._shakeComponent(shakingComponent);

    commentInput.disabled = false;
    this.getElement().querySelectorAll('.film-details__emoji-item').forEach((item) => {
      item.disabled = false;
    });
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setCloseBtnHandler(this._callback.closeBtnClick);

    this.setAddCommentHandler(this._callback.addCommentHandler);
    this.setRemoveCommentHandler(this._callback.removeCommentHandler);
  }

  getTemplate() {
    return createFilmDetails(this._data, this._comments);
  }

  setCloseBtnHandler(callback) {
    this._callback.closeBtnClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._clickCloseHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-details__control-label--watchlist').addEventListener('click', this._watchlistToggleHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-details__control-label--watched').addEventListener('click', this._watchedToggleHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-label--favorite').addEventListener('click', this._favoriteToggleHandler);
  }

  setAddCommentHandler(callback) {
    this._callback.addCommentHandler = callback;
  }

  setRemoveCommentHandler(callback) {
    this._callback.removeCommentHandler = callback;
  }
}
