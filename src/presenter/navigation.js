import NavigationView from '../view/navigation';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {NavItem} from '../utils/navigation.js';
import {NavigationType, NavigationTypeText, UpdateType} from '../const.js';

export default class Navigation {
  constructor(navigationContainer, navigationModel, filmsModel) {
    this._navigationContainer = navigationContainer;
    this._navigationModel = navigationModel;
    this._filmsModel = filmsModel;

    this._navigationComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleNavigationTypeChange = this._handleNavigationTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._navigationModel.addObserver(this._handleModelEvent);
  }

  init() {
    const navItems = this._getNavItems();
    const prevNavigationComponent = this._navigationComponent;

    this._navigationComponent = new NavigationView(navItems, this._navigationModel.getNavItem());
    this._navigationComponent.setNavItemTypeChangeHandler(this._handleNavigationTypeChange);

    if (prevNavigationComponent === null) {
      render(this._navigationContainer, this._navigationComponent, RenderPosition.BEFOREBEGIN);
      return;
    }

    replace(this._navigationComponent, prevNavigationComponent);
    remove(prevNavigationComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleNavigationTypeChange(navigationType) {
    if (this._navigationModel.getNavItem() === navigationType || !this._filmsModel.getFilms().length) {
      return;
    }

    this._navigationModel.setNavItem(UpdateType.MAJOR, navigationType);
  }

  _getNavItems() {
    const films = this._filmsModel.getFilms();
    return [
      {
        type: NavigationType.ALL,
        name: NavigationTypeText.ALL,
      },
      {
        type: NavigationType.WATCHLIST,
        name: NavigationTypeText.WATCHLIST,
        count: NavItem[NavigationType.WATCHLIST](films).length,
      },
      {
        type: NavigationType.WATCHED,
        name: NavigationTypeText.WATCHED,
        count: NavItem[NavigationType.WATCHED](films).length,
      },
      {
        type: NavigationType.FAVORITES,
        name: NavigationTypeText.FAVORITES,
        count: NavItem[NavigationType.FAVORITES](films).length,
      },
      {
        type: NavigationType.STATS,
        name: NavigationTypeText.STATS,
      },
    ];
  }
}
