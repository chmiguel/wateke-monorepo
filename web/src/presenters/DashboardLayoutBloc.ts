import { Cubit } from 'bloc-react';
import history from '../history';
import SelectedSpotBloc from '../core/blocs/SelectedSpotBloc';

export enum MenuTabs {
  Users = 0,
  Settings = 1,
}

interface ActionModalState {
  title?: string;
  isOpen: boolean;
  onAccept?: () => void;
}

interface DashboardLayoutState {
  currentMenuTab: MenuTabs;
  actionModal: ActionModalState;
  isDrawerVisible: boolean;
  routeToRedirect?: {
    path: string;
  };
}

const initialState: DashboardLayoutState = {
  currentMenuTab: MenuTabs.Users,
  actionModal: { isOpen: false },
  isDrawerVisible: false,
};

export default class DashboardLayoutBloc extends Cubit<DashboardLayoutState> {
  private selectedSpotBloc: SelectedSpotBloc;
  constructor(selectedSpotBloc: SelectedSpotBloc) {
    super(initialState);
    this.selectedSpotBloc = selectedSpotBloc;
  }

  setCurrentMenuTab = (tab: MenuTabs) =>
    this.emit({ ...this.state, currentMenuTab: tab });

  toggleDrawerVisibility = () => {
    this.emit({ ...this.state, isDrawerVisible: !this.state.isDrawerVisible });
  };

  leaveSpot = () => {
    this.selectedSpotBloc.closeSpot();
    history.replace('/select-spot');
  };

  unmount = () => {
    this.emit(initialState);
  };

  handleExitRequest = () => {
    this.emit({
      ...this.state,
      actionModal: {
        isOpen: true,
        title: 'Presiona "aceptar" para confirmar que quieres salir del spot',
        onAccept: this.leaveSpot,
      },
    });
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
