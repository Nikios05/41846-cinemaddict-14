import AbstractView from './abstract-view';
import {NavigationType} from '../const';

const createNavItemTemplate = (navItem, currentNavigationType) => {
  const {type, name, count} = navItem;
  let countTemplate = '';

  if (count !== undefined) {
    countTemplate = `<span class="main-navigation__item-count">${count}</span>`;
  }

  return `<a href="#${name}"
             id="${name}"
             class="
                main-navigation__link
                ${name === NavigationType.STATS ? 'main-navigation__additional' : 'main-navigation__item'}
                ${type === currentNavigationType ? 'main-navigation__item--active' : ''}"
          >${name} ${countTemplate}</a>`;
};

const createNavigationTemplate = (navItems, currentNavigationType) => {
  const navItemTemplate = navItems.map((navItem) => createNavItemTemplate(navItem, currentNavigationType)).join('');

  /*
  div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${filterTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
  */
  return `
    <nav class="main-navigation">
      ${navItemTemplate}
    </nav>
  `;
};

export default class Navigation extends AbstractView {
  constructor(filters, currentNavigationType) {
    super();

    this._filters = filters;
    this._currentNavItem = currentNavigationType;

    this._navItemTypeChangeHandler = this._navItemTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createNavigationTemplate(this._filters, this._currentNavItem);
  }

  _navItemTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.navItemTypeChange(evt.target.id);
  }

  setNavItemTypeChangeHandler(callback) {
    this._callback.navItemTypeChange = callback;

    this.getElement().querySelectorAll('.main-navigation__link').forEach((link) => {
      link.addEventListener('click', this._navItemTypeChangeHandler);
    });
  }
}
