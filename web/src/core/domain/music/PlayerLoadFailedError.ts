export default class PlayerLoadFailedError extends Error {
  constructor() {
    super('Player failed to load');
  }
}
