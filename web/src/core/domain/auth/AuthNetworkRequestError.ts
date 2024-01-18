export default class AuthNetworkRequestError extends Error {
    constructor(){
        super('Error de conexión, por favor verifique su conexión a internet')
    }
}