export default class PermissionDeniedError extends Error {
  constructor() {
    super('Has sido bloqueado en este spot, no podrás interacctuar en el');
  }
}
