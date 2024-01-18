import { Cubit } from 'bloc-react';
import { User } from '../domain/auth/User';
import UserRepository from '../domain/auth/UserRepository';

interface UserState extends User {
  token?: string;
}

export default class UserBloc extends Cubit<UserState> {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    super(new User({}));
    this.userRepository = userRepository;
    this.initialize();
  }

  initialize = async () => {
    const user = await this.userRepository.getCurrentUser();
    this.emit(user);
  };

  login = (user: User) => {
    this.userRepository.setCurrentUser(user);
    this.emit(user);
  };

  logout = () => {
    const emptyUser = new User({});
    this.userRepository.setCurrentUser(emptyUser);
    this.emit(emptyUser);
  };

  authenticateWithGoogle = async () => {
    const user = await this.userRepository.authenticateWithGoogle();
    this.login(user);
  };
}
