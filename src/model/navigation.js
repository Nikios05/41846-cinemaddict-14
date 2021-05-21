import Observer from '../utils/observer.js';
import {NavigationType} from '../const.js';

export default class Navigation extends Observer {
  constructor() {
    super();
    this._activeNavItem = NavigationType.ALL;
  }

  setNavItem(updateType, navItem) {
    this._activeNavItem = navItem;
    this._notify(updateType, navItem);
  }

  getNavItem() {
    return this._activeNavItem;
  }
}
