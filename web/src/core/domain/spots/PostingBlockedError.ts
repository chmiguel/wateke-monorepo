export default class PostingBlockedError extends Error {
  constructor() {
    super(
      'El administrador ha bloqueado la publicación de canciones. Sólo podrás reaccionar a las que se publiquen',
    );
  }
}
