import SmartView from './smart-view';
import {getProfileRank} from '../utils/film-helper';

const createProfileTemplate = (watchedFilms) => {
  return `
    <section class="header__profile profile">
      <p class="profile__rating">${getProfileRank(watchedFilms)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
};


export default class Profile extends SmartView {
  constructor(watchedFilms) {
    super();
    this._watchedFilms = watchedFilms;
  }

  getTemplate() {
    return createProfileTemplate(this._watchedFilms);
  }
}
