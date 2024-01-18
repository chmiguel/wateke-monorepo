export default class SongFromWrongProviderError extends Error {
    constructor() {
      super(
        `Disculpe, usted esta intentando postular una cancion de un proveedor de música diferente al del playlist actual, recargue la página e intente nuevamente.`,
      );
    }
  }
  