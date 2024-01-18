import React, { ReactElement, useEffect } from 'react';
import Drawer from '@material-ui/core/Drawer';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { MdArrowBack, MdGroup, MdSettings, MdExitToApp } from 'react-icons/md';
import Header from '../generics/Header';
import SpotUser from '../dashboard/SpotUser';
import ActionModal from '../generics/ActionModal';
import { BlocBuilder, selectedSpotBloc, useBloc } from '../../core/state';
import DashboardBloc from '../../presenters/DashboardBloc';
import SelectedSpotBloc from '../../core/blocs/SelectedSpotBloc';
import DashboardLayoutBloc, {
  MenuTabs,
} from '../../presenters/DashboardLayoutBloc';
import withBloc from '../../core/withBlocHOC';
import SpotInfoMenu from '../dashboard/SpotInfoMenu';
import Settings from '../dashboard/Settings/Settings';

const getTabsStyle = (isActive: boolean) => ({
  label: isActive ? 'color-primary' : 'color-white',
});

interface Props {
  children: ReactElement;
}

const DashboardLayout: React.FC<Props> = ({ children }): ReactElement => {
  const history = useHistory();

  const [selectedSpotState, selectedSpotBloc] = useBloc(SelectedSpotBloc, {
    subscribe: false,
  });
  const [_, dashboardBloc] = useBloc(DashboardBloc, { subscribe: false });
  const [state, bloc] = useBloc(DashboardLayoutBloc);

  useEffect(() => {
    if (state.routeToRedirect) history.replace(state.routeToRedirect.path);
  }, [state.routeToRedirect]);

  return (
    <div>
      <Header
        shouldShowAppIcon
        title={selectedSpotState.spot!.name}
        onMenuClicked={bloc.toggleDrawerVisibility}
        onSearchPressed={dashboardBloc.searchSongsByText}
        onSearchTextChanged={dashboardBloc.handleSearchTextChange}
        onAppIconPressed={bloc.handleExitRequest}
        rightMenuElement={
          <SpotInfoMenu
            spotName={selectedSpotState.spot!.name}
            spotLink={`http://${window.location.host}/spots/${
              selectedSpotState.spot!.id
            }`}
          />
        }
      />
      <ActionModal
        open={state.actionModal.isOpen}
        title={state.actionModal.title}
        acceptAction={state.actionModal.onAccept}
        cancelAction={bloc.closeActionModal}
      />
      <Drawer
        open={state.isDrawerVisible}
        onClose={bloc.toggleDrawerVisibility}
        classes={{ paper: 'drawer-container' }}
      >
        <DrawerContainer>
          <BackIcon className="opacity" onClick={bloc.toggleDrawerVisibility}>
            <MdArrowBack color="#FFF" size={15} />
          </BackIcon>

          <SideMenuContent>
            <div className="tabs-100">
              <Tabs
                value={state.currentMenuTab}
                onChange={(_, index) => bloc.setCurrentMenuTab(index)}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                classes={{
                  indicator: 'tabs-indicator',
                }}
              >
                <Tab
                  label={<MdGroup color="#FFF" size={30} />}
                  classes={getTabsStyle(
                    state.currentMenuTab === MenuTabs.Users,
                  )}
                />
                <Tab
                  label={<MdSettings color="#FFF" size={30} />}
                  classes={getTabsStyle(
                    state.currentMenuTab === MenuTabs.Settings,
                  )}
                />
              </Tabs>

              {state.currentMenuTab === MenuTabs.Users ? (
                <div
                  style={{
                    height: 'calc(100vh - 180px)',
                    overflowY: 'auto',
                    minHeight: 200,
                  }}
                >
                  <TitleContainer>
                    <Title>Usuarios</Title>
                    {selectedSpotBloc.isCurrentUserAdmin() ? (
                      <TitleAction>Bloquear</TitleAction>
                    ) : null}
                  </TitleContainer>
                  <BlocBuilder
                    blocClass={DashboardBloc}
                    builder={([dashboardState, dashboardBloc]) => (
                      <>
                        {dashboardState?.spotUsers?.map((item, i) => (
                          <SpotUser
                            key={`us_${i}`}
                            user={item}
                            toggleBlockedStatus={dashboardBloc.toggleBlockUser}
                            isAdmin={selectedSpotBloc.isCurrentUserAdmin()}
                          />
                        ))}
                      </>
                    )}
                  />
                </div>
              ) : null}
              {state.currentMenuTab === MenuTabs.Settings ? (
                <div style={{ overflowY: 'auto', minHeight: 200 }}>
                  <Settings />
                </div>
              ) : null}
            </div>

            <MenuContainer>
              <MenuItemContainer onClick={bloc.handleExitRequest}>
                <IconContainer>
                  <MdExitToApp size={25} color="#FFF" />
                </IconContainer>
                <DescriptionContainer>Salir</DescriptionContainer>
              </MenuItemContainer>
            </MenuContainer>
          </SideMenuContent>
        </DrawerContainer>
      </Drawer>
      {children}
    </div>
  );
};

const DrawerContainer = styled.div`
  width: 350px;
  z-index: 100000000000;
  overflow-x: hidden;
  height: 100%;
`;

const BackIcon = styled.div`
  margin: 10px;
  float: right;
  width: 25px;
  height: 25px;
  background-color: #ea4335;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
`;

const SideMenuContent = styled.div`
  margin-top: 20px;
`;
const TitleContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.6;
  letter-spacing: normal;
  text-align: left;
  color: #979ca8;
  margin-left: 10px;
`;
const TitleAction = styled.div`
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.6;
  letter-spacing: normal;
  text-align: right;
  color: #979ca8;
  margin-right: 10px;
`;

const MenuContainer = styled.div`
  width: 100%;
`;

const MenuItemContainer = styled.div`
  display: flex;
  height: 40px;
  width: 100%;
  cursor: pointer;
  :hover {
    background-color: #111a1fa0;
    border-bottom: 1px solid #0d1419;
  }
`;

const IconContainer = styled.div`
  width: 15%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DescriptionContainer = styled.div`
  width: 85%;
  height: 40px;
  color: #fff;
  font-size: 16px;
  padding-top: 10px;
`;

export default withBloc(
  DashboardLayout,
  () => new DashboardLayoutBloc(selectedSpotBloc),
);
