import SmartView from './smart-view';

const createFilmsTemplate = () => {
  return '<section class="films"></section>';
};

export default class FilmsGrid extends SmartView {
  getTemplate() {
    return createFilmsTemplate();
  }
}
