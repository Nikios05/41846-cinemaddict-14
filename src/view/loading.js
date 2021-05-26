import SmartView from './smart-view';

const createLoadingTemplate = () => {
  return '<h2 class="films-list__title">Loading...</h2>';
};

export default class Loading extends SmartView {
  getTemplate() {
    return createLoadingTemplate();
  }
}
