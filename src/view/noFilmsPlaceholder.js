import SmartView from './smart-view';

const createNoFilmsTemplate = () => {
  return '<h2 class="films-list__title">There are no movies in our database</h2>';
};

export default class NoFilmsPlaceholder extends SmartView {
  getTemplate() {
    return createNoFilmsTemplate();
  }
}
