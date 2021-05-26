import SmartView from './smart-view';

const createNoFilmsTemplate = () => {
  return '<h2 class="films-list__title">Loading...</h2>';
};

export default class Loading extends SmartView {
  getTemplate() {
    return createNoFilmsTemplate();
  }
}
