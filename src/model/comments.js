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

  addComment(comments) {
    this._comments = comments;
  }

  removeComment(delCommentId) {
    const delIndex = this._comments.findIndex((id) => id === delCommentId);
    this._comments = [
      ...this._comments.slice(0, delIndex),
      ...this._comments.slice(delIndex + 1),
    ];
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        text: comment.comment,
      },
    );

    delete comment.comment;

    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        'comment' : comment.text,
      },
    );

    delete adaptedComment.text;

    return adaptedComment;
  }
}
