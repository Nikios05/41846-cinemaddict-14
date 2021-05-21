import Observer from '../utils/observer.js';

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setFilmComments(comments) {
    this._comments = comments.slice();
  }

  getFilmComments() {
    return this._comments;
  }

  addComment(comment) {
    this._comments = [
      comment,
      ...this._comments,
    ];
  }

  removeComment(delIndex) {
    if (delIndex === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this._comments = [
      ...this._comments.slice(0, delIndex),
      ...this._comments.slice(delIndex + 1),
    ];
  }
}
