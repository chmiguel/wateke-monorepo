import { instance, mock, verify } from 'ts-mockito';
import SelectedSpotBloc from '../core/blocs/SelectedSpotBloc';
import DashboardLayoutBloc, { MenuTabs } from './DashboardLayoutBloc';

describe('DashboardLayoutBloc should', () => {
  it('change to the settings tab if user was in users tab', async () => {
    expect(presenter.state.currentMenuTab).toBe(MenuTabs.Users);

    presenter.setCurrentMenuTab(MenuTabs.Settings);

    expect(presenter.state.currentMenuTab).toBe(MenuTabs.Settings);
  });

  it('open the drawer menu if it was closed', async () => {
    expect(presenter.state.isDrawerVisible).toBeFalsy();

    presenter.toggleDrawerVisibility();

    expect(presenter.state.isDrawerVisible).toBeTruthy();
  });

  it('close the drawer menu if it was open', async () => {
    presenter.toggleDrawerVisibility();
    expect(presenter.state.isDrawerVisible).toBeTruthy();

    presenter.toggleDrawerVisibility();
    expect(presenter.state.isDrawerVisible).toBeFalsy();
  });

  it('open a confirm exit modal when user presses the exit button', async () => {
    expect(presenter.state.actionModal).toStrictEqual({ isOpen: false });

    presenter.handleExitRequest();

    expect(presenter.state.actionModal.isOpen).toBeTruthy();
  });

  it('close the confirm exit modal when user selects such option', async () => {
    expect(presenter.state.actionModal).toStrictEqual({ isOpen: false });
    presenter.handleExitRequest();
    expect(presenter.state.actionModal.isOpen).toBeTruthy();

    presenter.closeActionModal();

    expect(presenter.state.actionModal.isOpen).toBeFalsy();
  });

  it('leave the spot when user confirms the exit request', async () => {
    expect(presenter.state.routeToRedirect).toBeUndefined();

    presenter.leaveSpot();

    verify(selectedSpotBloc.closeSpot()).called();
  });

  beforeEach(() => {
    selectedSpotBloc = mock<SelectedSpotBloc>();
    presenter = createPresenter();
  });

  function createPresenter(): DashboardLayoutBloc {
    const mockNavigationService = {} as any; // Mock navigation service for tests
    return new DashboardLayoutBloc(instance(selectedSpotBloc), mockNavigationService);
  }

  let presenter: DashboardLayoutBloc;
  let selectedSpotBloc: SelectedSpotBloc;
});
