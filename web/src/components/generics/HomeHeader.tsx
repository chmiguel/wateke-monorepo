import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MdMoreVert } from 'react-icons/md';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorElement, setAnchorElement] = useState<SVGElement | null>(null);

  const goToAnchor = (id: string) => {
    if (location.pathname === '/landing') {
      const elmnt = document.getElementById(id);
      elmnt?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/landing', {
        state: { anchorId: id },
      });
    }
  };

  const handleMenuPressed = useCallback(
    (event: React.MouseEvent<SVGElement>) => {
      setAnchorElement(event.currentTarget);
    },
    [],
  );

  const handleCloseMenu = useCallback(() => {
    setAnchorElement(null);
  }, []);

  return (
    <HeaderContainer>
      <Logo
        src="/assets/images/logo-white.svg"
        alt="logo"
        onClick={() => goToAnchor('items0')}
        className="opacity"
      />
      <ContainerItems>
        <ItemsHeader onClick={() => goToAnchor('items1')}>
          CÓMO FUNCIONA
        </ItemsHeader>
        <ItemsHeader onClick={() => goToAnchor('items2')}>
          DESCARGAR APP
        </ItemsHeader>
        <ItemsHeader onClick={() => goToAnchor('items3')}>
          DÓNDE USAR
        </ItemsHeader>
        <NavLink to="/login">
          <ItemsHeader>INGRESAR</ItemsHeader>
        </NavLink>
      </ContainerItems>
      <ResponsiveMenu>
        <MdMoreVert color="#FFF" size="30px" onClick={handleMenuPressed} />
        <Menu
          id="simple-menu"
          anchorEl={anchorElement as HTMLElement | null}
          open={Boolean(anchorElement)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleCloseMenu}>
            <ItemsHeader onClick={() => goToAnchor('items1')}>
              COMO FUNCIONA
            </ItemsHeader>
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>
            <ItemsHeader onClick={() => goToAnchor('items2')}>
              DESCARGAR APP
            </ItemsHeader>
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>
            <ItemsHeader onClick={() => goToAnchor('items3')}>
              DONDE USAR
            </ItemsHeader>
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>
            <NavLink to="/login">
              <ItemsHeader>INGRESAR</ItemsHeader>
            </NavLink>
          </MenuItem>
        </Menu>
      </ResponsiveMenu>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  width: 100%;
  height: 65px;
  background-color: rgba(16, 23, 28, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  z-index: 9999;
  position: fixed;
  @media (max-width: 768px) {
    z-index: 9;
  }
`;
const Logo = styled.img`
  width: auto;
  height: ${props => props.height || '50px'};
  padding-left: 50px;
`;
const ContainerItems = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    display: none;
  }
`;
const ItemsHeader = styled.div`
  font-family: Poppins;
  font-size: 16px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.56;
  letter-spacing: normal;
  text-align: center;
  color: #979ca8;
  padding-right: 10px;
  padding-left: 10px;
  height: 30px;
  transition-duration: 0.3s;
  transition-timing-function: ease-out;
  border-bottom: solid 3px transparent;
  :hover {
    cursor: pointer;
    border-bottom: solid 3px #00fece;
    color: #fff;
  }
`;
const ResponsiveMenu = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

export default Header;
