import AbstractView from './abstract-view';

const renderFilter = ({name, count}) => {
  return `<a href="#${name}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`;
};

const createNavigationTemplate = (filters) => {
  const filterTemplate = filters.map((filter) => renderFilter(filter)).join('');

  return `
    <nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${filterTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>

    <ul class="sort">
      <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" class="sort__button">Sort by date</a></li>
      <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>
  `;
};

export default class Navigation extends AbstractView {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createNavigationTemplate(this._filters);
  }
}
