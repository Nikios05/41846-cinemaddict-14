import {createElement} from '../utils';

const createShowMoreBtn = () => {
  return `
    <button class="films-list__show-more">Show more</button>
  `;
};


export default class MoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createShowMoreBtn();
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
