import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import styled from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../components/generics/Button';
import AbsoluteLoader from '../components/generics/AbsoluteLoader';
import ActionModal from '../components/generics/ActionModal';
import Header from '../components/generics/HomeHeader';
import Footer from '../components/generics/Footer';
import { useBloc } from '../core/state';
import UserBloc from '../core/blocs/UserBloc';

const Login: React.FC = (): ReactElement => {
  const [_, userBloc] = useBloc(UserBloc, { subscribe: false });
  const [isLoading, setIsLoading] = useState(false);
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    title?: string;
  }>({ isOpen: false });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.innerWidth < 500) {
      const loginBox = window.document.getElementById('login-box');
      if (loginBox) {
        setTimeout(() => {
          loginBox.scrollIntoView({
            behavior: 'smooth',
          });
        }, 1000);
      }
    }
  }, []);

  const closeActionModal = useCallback(() => {
    setActionModal({ isOpen: false });
  }, []);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    userBloc
      .authenticateWithGoogle()
      .then(() => {
        setIsLoading(false);
      })
      .catch(e => {
        if (e.code === 'auth/account-exists-with-different-credential') {
          setActionModal({
            isOpen: true,
            title:
              'Una cuenta ya esta vínculada a este correo electrónico, intenta iniciar sesión Facebook!',
          });
        } else {
          toast.error(e.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'rounded bold-text',
          });
        }
        setIsLoading(false);
      });
  };

  return (
    <div>
      {window.innerWidth > 500 ? <Header /> : null}

      <AbsoluteLoader visible={isLoading}>
        <Splash>
          <ActionModal
            open={actionModal.isOpen}
            title={actionModal.title}
            acceptAction={closeActionModal}
            cancelAction={closeActionModal}
          />
          <AbsoluteContainer>
            <OptionsContainer>
              <LeftContainer>
                <MobileHelper id="login-box" />
                <Title
                  align="center"
                  style={{ marginTop: 20 }}
                  marginBottom="30px"
                  marginBottomXs="20px"
                >
                  Bienvenido
                </Title>
                <Subtitle
                  align="center"
                  marginBottom="60px"
                  marginBottomXs="30px"
                >
                  Wateke se trata de interactuar y decidir la música que se
                  escucha en tus lugares favoritos.
                </Subtitle>
                <div className="total-center">
                  <AppIcon src="/assets/images/logo.svg" alt="" />
                </div>
              </LeftContainer>
              <HorizontalDivider />
              <RightContainer>
                <Title
                  responsiveColor="#505050"
                  align="left"
                  marginBottom="30px"
                  marginBottomXs="10px"
                >
                  Iniciar sesión
                </Title>
                <Subtitle align="left" fontSize="12px" marginBottom="5px">
                  Inicia sesión rápido con Google
                </Subtitle>
                <Button
                  style={{
                    marginBottom: 20,
                    width:
                      window.innerWidth <= 420 ? 'calc(100vw - 100px)' : 260,
                  }}
                  onClick={handleGoogleLogin}
                >
                  <div style={{ width: '100%' }} className="row-cont">
                    <GoogleIcon src="/assets/icons/google.svg" alt="" />
                    <div
                      style={{
                        flexGrow: 1,
                        flexBasis: 0,
                      }}
                    >
                      <p
                        style={{
                          paddingRight: 5,
                          fontSize: 14,
                          marginLeft: -25,
                          color: '#808080',
                        }}
                      >
                        Ingresa con Google
                      </p>
                    </div>
                  </div>
                </Button>
              </RightContainer>
            </OptionsContainer>
          </AbsoluteContainer>

          <ToastContainer />
        </Splash>
      </AbsoluteLoader>
      <Footer />
    </div>
  );
};

const Splash = styled.div`
  min-height: 100vh;
  background-image: ${window.innerWidth > 500
    ? "url('/assets/images/login-splash.jpg')"
    : "url('/assets/images/login-splash-mobile.jpg')"};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  filter: blur(0px);
  position: relative;
`;

const AbsoluteContainer = styled.div`
  z-index: 100;
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  border-radius: 6px;
  min-height: 500px;
  max-width: 800px;
  width: 100%;
  @media (max-width: 820px) {
    flex-direction: column;
    height: 100vh;
    padding: 0px;
  }
`;

const HorizontalDivider = styled.div`
  height: 500px;
  width: 1px;
  min-width: 1px;
  background-color: #eaeaea;
  margin: 0px 40px;
  @media (max-width: 820px) {
    display: none;
  }
`;

const MobileHelper = styled.div`
  height: 10px;
`;

const LeftContainer = styled.div`
  flex: 1;
  height: 500px;
  @media (max-width: 820px) {
    padding: 55px 20px 20px 20px;
  }
`;

const RightContainer = styled.div`
  flex: 1;
  @media (max-width: 820px) {
    flex: 0;
    background-color: #fff;
    width: calc(100vw - 40px);
    padding-top: 10px;
    padding-left: 40px;
    padding-bottom: 20px;
  }
`;

const AppIcon = styled.img`
  height: 150px;
  margin-bottom: 10px;
  @media (max-width: 420px) {
    height: 100px;
  }
`;

const GoogleIcon = styled.img`
  height: 25px;
  width: 25px;
`;

const Title = styled.p`
  font-weight: bold;
  color: #fff;
  font-size: 20px;
  text-align: ${props => props.align};
  margin-bottom: ${props => props.marginBottom};
  font-size: ${props => props.fontSize};
  @media (max-width: 820px) {
    color: ${props => props.responsiveColor};
    margin-bottom: ${props => props.marginBottomXs};
    font-size: ${props => props.fontSizeXs};
  }
`;

const Subtitle = styled.p`
  color: #a0a0a0;
  font-size: 14px;
  text-align: ${props => props.align};

  margin-bottom: ${props => props.marginBottom};
  font-size: ${props => props.fontSize};
  @media (max-width: 820px) {
    color: ${props => props.responsiveColor};
    margin-bottom: ${props => props.marginBottomXs};
    font-size: ${props => props.fontSizeXs};
  }
`;

export default Login;
