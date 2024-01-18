import React, { ReactElement } from 'react';
import Drawer from '@material-ui/core/Drawer';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdMusicVideo,
  MdLibraryMusic,
  MdExitToApp,
} from 'react-icons/md';
import Header from '../generics/Header';
import Footer from '../generics/Footer';
import ActionModal from '../generics/ActionModal';
import { useBloc, userBloc } from '../../core/state';
import withBloc from '../../core/withBlocHOC';
import MainLayoutBloc from '../../presenters/MainLayoutBloc';
import { NavLink } from 'react-router-dom';

interface Props {
  shouldShowAppIcon?: boolean;
  shouldShowFooter?: boolean;
  title?: string;
  onSearchRequested?: () => void;
  onSearchTextChanged?: (text: string) => void;
  children: ReactElement | ReactElement[];
}

const MainLayout: React.FC<Props> = ({
  title,
  shouldShowAppIcon,
  children,
  shouldShowFooter = true,
  onSearchRequested,
  onSearchTextChanged,
}): ReactElement => {
  const [state, bloc] = useBloc(MainLayoutBloc);

  return (
    <div>
      <Header
        shouldShowAppIcon={shouldShowAppIcon}
        title={title}
        onMenuClicked={bloc.toggleDrawerVisibility}
        onSearchPressed={onSearchRequested}
        onSearchTextChanged={onSearchTextChanged}
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
            <MenuContainer>
              <NavLink to="/select-spot">
                <MenuItemContainer>
                  <IconContainer>
                    <MdMusicVideo size={25} color="#FFF" />
                  </IconContainer>
                  <DescriptionContainer>Buscar Spots</DescriptionContainer>
                </MenuItemContainer>
              </NavLink>
              <NavLink to="/my-spots">
                <MenuItemContainer>
                  <IconContainer>
                    <MdLibraryMusic size={25} color="#FFF" />
                  </IconContainer>
                  <DescriptionContainer>Mis Spots</DescriptionContainer>
                </MenuItemContainer>
              </NavLink>
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
      {shouldShowFooter && <Footer />}
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

export default withBloc(MainLayout, () => new MainLayoutBloc(userBloc));
