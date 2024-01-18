import { User } from "./User";

export default interface AuthService {
    authenticateWithGoogle(): Promise<User>;
}