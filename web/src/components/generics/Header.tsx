import React, { ReactElement, useCallback, useState } from 'react';
import styled from 'styled-components';
import { MdSearch, MdClear } from 'react-icons/md';
import { Tween } from 'react-gsap';
import { accentColor } from '../../constants';
import { BlocBuilder } from '../../core/state';
import UserBloc from '../../core/blocs/UserBloc';

interface Props {
  onAppIconPressed?: () => void;
  onMenuClicked?: () => void;
  title?: string;
  shouldShowAppIcon?: boolean;
  onSearchPressed?: () => void;
  onSearchTextChanged?: (searchText: string) => void;
  rightMenuElement?: ReactElement;
  isDashboard?: boolean;
}

const Header: React.FC<Props> = ({
  onAppIconPressed,
  onMenuClicked,
  onSearchPressed,
  onSearchTextChanged,
  shouldShowAppIcon = false,
  title,
  isDashboard = true,
  rightMenuElement,
}) => {
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);

  const handleSearch = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.which === 13 || event.keyCode === 13) onSearchPressed?.();
    },
    [onSearchPressed],
  );

  const handleSearchTextChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      onSearchTextChanged?.(event.currentTarget.value);
    },
    [onSearchTextChanged],
  );

  const toggleIsSearchBarVisible = useCallback(() => {
    setIsSearchBarVisible(prev => !prev);
  }, []);

  return (
    <HeaderContainer $isDashboard={isDashboard}>
      <MenuIcon
        src="/assets/icons/icon-menu-white.svg"
        alt="menu-icon"
        height="15"
        className="opacity"
        onClick={onMenuClicked}
      />

      {shouldShowAppIcon ? (
        <IconAppSmall
          src="/assets/images/logo.svg"
          alt="logo-icon"
          height="35"
          className="opacity"
          onClick={onAppIconPressed}
        />
      ) : null}
      {!isSearchBarVisible ? (
        <Tween duration={0.3} from={{ rotationY: '+=180' }}>
          <Title>{title ? title : 'Wateke'}</Title>
        </Tween>
      ) : null}
      <RightMenuContainer>
        {isSearchBarVisible ? (
          <Tween duration={0.3} from={{ rotationX: '+=180' }}>
            <SearchContainer>
              <IconContainer>
                <MdSearch color="#FFF" size={25} />
              </IconContainer>
              <InputContainer>
                <InputSearch
                  placeholder="Buscar..."
                  onKeyPress={handleSearch}
                  onChange={handleSearchTextChange}
                />
              </InputContainer>
              <IconContainer
                onClick={toggleIsSearchBarVisible}
                className="opacity"
              >
                <MdClear color="#FFF" size={25} />
              </IconContainer>
            </SearchContainer>
          </Tween>
        ) : null}
        {window.innerWidth <= 680 && !isSearchBarVisible ? (
          <IconContainer
            onClick={toggleIsSearchBarVisible}
            style={{ paddingRight: 10 }}
            className="opacity"
          >
            <MdSearch color={accentColor} size={25} />
          </IconContainer>
        ) : null}

        {window.innerWidth > 680 ? (
          <BlocBuilder
            blocClass={UserBloc}
            builder={([userState]) => (
              <Avatar $src={userState.avatar} className="opacity" />
            )}
          />
        ) : null}
        {rightMenuElement}
      </RightMenuContainer>
    </HeaderContainer>
  );
};

interface HeaderContainerProps {
  $isDashboard: boolean;
}

const HeaderContainer = styled.div<HeaderContainerProps>`
  width: 100%;
  height: 50px;
  background-color: #070707a0;
  position: fixed;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 2;
  @media (max-width: 420px) {
    background-color: ${props =>
      props.$isDashboard ? 'transparent' : '#070707a0'};
  }
`;

const RightMenuContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

interface AvatarProps {
  $src: string | null;
}

const Avatar = styled.div<AvatarProps>`
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background-image: ${props => `url(${props.$src})`};
  background-size: cover;
  margin-right: 15px;
  @media (max-width: 420px) {
    display: none;
  }
`;

const MenuIcon = styled.img`
  margin-left: 15px;
`;

const IconAppSmall = styled.img`
  margin-left: 15px;
  @media (max-width: 420px) {
    display: none;
  }
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-left: 20px;
  flex: 1;
  max-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface SearchContainerProps {
  $xsHidden?: boolean;
}

const SearchContainer = styled.div<SearchContainerProps>`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 5px;
  border-radius: 10px;
  margin-right: 20px;
  :hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  @media (max-width: 680px) {
    display: ${props => (props.$xsHidden ? 'none' : 'flex')};
    width: calc(100vw - 80px);
    margin-left: 20px;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
  flex: 1;
  margin-left: 10px;
`;

const InputSearch = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: #fff;
  -webkit-transition: width 1s; /* Safari */
  transition: width 1s;
  flex: 1;
  width: calc(100% - 20px);
`;

export default Header;
