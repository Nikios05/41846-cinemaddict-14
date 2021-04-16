import {createElement} from '../utils';

const createFilmsList = (extraList, className, title, hiddenTitle) => {
  return `
    <section class="films-list films-list--${className} ${extraList && 'films-list--extra'}">
      <h2 class="films-list__title ${hiddenTitle && 'visually-hidden'}">${title}</h2>

      <div class="films-list__container">
      </div>
    </section>
  `;
};

export default class FilmList {
  constructor(extraList, className, title, hiddenTitle = false) {
    this._extraList = extraList;
    this._className = className;
    this._title = title;
    this._hiddenTitle = hiddenTitle;
    this._element = null;
  }

  getTemplate() {
    return createFilmsList(this._extraList, this._className, this._title, this._hiddenTitle);
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
