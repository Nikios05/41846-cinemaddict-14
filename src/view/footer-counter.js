import SmartView from './smart-view';

const createFooterCounterTemplate = (filmsCount) => {
  return `<p>${filmsCount} movies inside</p>`;
};

export default class FooterCounter extends SmartView {
  constructor(films) {
    super();

    this._films = films;
  }
  getTemplate() {
    return createFooterCounterTemplate(this._films.length);
  }
}
