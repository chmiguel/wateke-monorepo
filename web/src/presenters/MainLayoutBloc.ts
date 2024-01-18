import { Cubit } from 'bloc-react';
import UserBloc from '../core/blocs/UserBloc';

interface ActionModalState {
  title?: string;
  isOpen: boolean;
  onAccept?: () => void;
}

interface MainLayoutState {
  actionModal: ActionModalState;
  isDrawerVisible: boolean;
  routeToRedirect?: {
    path: string;
  };
}

export default class MainLayoutBloc extends Cubit<MainLayoutState> {
  private userBloc: UserBloc;
  constructor(userBloc: UserBloc) {
    super({
      actionModal: { isOpen: false },
      isDrawerVisible: false,
    });
    this.userBloc = userBloc;
  }

  toggleDrawerVisibility = () => {
    this.emit({ ...this.state, isDrawerVisible: !this.state.isDrawerVisible });
  };

  handleExitRequest = () => {
    this.emit({
      ...this.state,
      actionModal: {
        isOpen: true,
        title: 'Presiona aceptar para confirmar que deseas cerrar tu sesión',
        onAccept: this.logout,
      },
    });
  };

  logout = () => {
    this.userBloc.logout();
  };

  closeActionModal = () => {
    this.emit({
      ...this.state,
      actionModal: {
        isOpen: false,
      },
    });
  };
}
