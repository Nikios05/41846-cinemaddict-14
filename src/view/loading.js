import AbstractView from './abstract-view';

const createNoFilmsTemplate = () => {
  return '<h2 class="films-list__title">Loading...</h2>';
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createNoFilmsTemplate();
  }
}
