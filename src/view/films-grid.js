import AbstractView from './abstract-view';

const createFilmsTemplate = () => {
  return '<section class="films"></section>';
};

export default class FilmsGrid extends AbstractView {
  getTemplate() {
    return createFilmsTemplate();
  }
}
