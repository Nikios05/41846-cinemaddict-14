import AbstractView from './abstract-view';
import {NavigationTypeText} from '../const';

const createNavItemTemplate = (navItem, currentNavigationType) => {
  const {type, name, count} = navItem;
  let countTemplate = '';

  if (count !== undefined) {
    countTemplate = `<span class="main-navigation__item-count">${count}</span>`;
  }

  return `<a href="#${name}"
             id="${type}"
             class="
                main-navigation__link
                ${name === NavigationTypeText.STATS ? 'main-navigation__additional' : 'main-navigation__item'}
                ${type === currentNavigationType ? 'main-navigation__item--active' : ''}"
          >${name} ${countTemplate}</a>`;
};

const createNavigationTemplate = (navItems, currentNavigationType) => {
  const navItemTemplate = navItems.map((navItem) => createNavItemTemplate(navItem, currentNavigationType)).join('');

  return `
    <nav class="main-navigation">
      ${navItemTemplate}
    </nav>
  `;
};

export default class Navigation extends AbstractView {
  constructor(navItems, currentNavigationType) {
    super();

    this._navItems = navItems;
    this._currentNavItem = currentNavigationType;

    this._navItemTypeChangeHandler = this._navItemTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createNavigationTemplate(this._navItems, this._currentNavItem);
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
