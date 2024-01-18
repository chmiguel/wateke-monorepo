import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';

import CardOnBoarding from '../components/generics/CardOnBoarding';
import Footer from '../components/generics/Footer';
import Header from '../components/generics/HomeHeader';
import { NavLink, useHistory } from 'react-router-dom';

const PrevArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <img
    onClick={onClick}
    className="slick-prev"
    src="/assets/images/prev-arrow.svg"
    alt="prev"
  />
);
const NextArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <img
    onClick={onClick}
    className="slick-next"
    src="/assets/images/next-arrow.svg"
    alt="next"
  />
);

const LandingPage: React.FC = () => {
  const history = useHistory<{ anchorId: string }>();
  const scrollingTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (history.location.state && history.location.state.anchorId) {
      scrollingTimeout.current = setTimeout(() => {
        const element = document.getElementById(
          history.location.state.anchorId,
        );
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
    return () => {
      if (scrollingTimeout.current) clearTimeout(scrollingTimeout.current);
    };
  });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
        },
      },
      {
        breakpoint: 500,
        settings: {
          autoplay: true,
          arrows: false,
        },
      },
    ],
  };
  return (
    <div className="box-landing-page">
      <Header />
      <div className="section-main-landing " id="items0">
        <div
          className="total-center"
          style={{
            backgroundColor: 'rgba( 0, 0, 0, 0.7)',
            minHeight: '100vh',
          }}
        >
          <GridMain>
            <div>
              <p className="main-title-landing">
                Estaremos presente en <span>Nuer festival</span>{' '}
              </p>
              <div className="divider margin-top-20 hidden-786" />
              <MainTitle
                fontSize="18px"
                colorText="#FFF"
                marginTop="15px"
                fontSizeResponisve="20px"
              >
                Nuestro Amanecer
              </MainTitle>
              <Description
                colorText="#979ca8"
                textAlign="left"
                fontSize="15px"
                fontSizeResponisve="12px"
                maxWidth="550px"
                textAlignResponisve="center"
              >
                Festival Cultural: Conciertos, conversatorios e ideas nuevas.
              </Description>
            </div>
            <div>
              <LogoBanner
                src="/assets/images/logo-nuer.svg"
                alt=" NuerFestival "
                width="auto"
                height="100%"
              />
            </div>
          </GridMain>
        </div>
      </div>
      <div className="total-center section-landing">
        <BoxSlider id="items1">
          <Slider {...settings}>
            <div>
              <DarkPaper>
                <div className="total-center">
                  <div className="width-default-content">
                    <MainTitle fontSizeResponisve="30px">
                      ¿Cómo funciona Wateke?
                    </MainTitle>
                    <Description
                      colorText="#979ca8"
                      textAlign="left"
                      fontSize="15px"
                      fontSizeResponisve="12px"
                    >
                      Los Spots son espacios digitales que dispone un
                      administrador para sus usuarios.
                    </Description>
                    <div className="divider margin-top-20" />
                  </div>
                </div>
                <div className="total-center">
                  <CardOnBoarding
                    title="Selecciona el Spot de tu preferencia"
                    description="Únete al Spot del gimnasio, restaurante, tu estación de radio preferida o cualquier lugar donde encuentres la aplicación 
                                            de Wateke y sugiere la música de tu gusto. La canción postulada que obtenga más reacciones positivas, será la próxima 
                                            en sonar."
                  />
                </div>
              </DarkPaper>
            </div>
            <div>
              <DarkPaper>
                <div className="total-center">
                  <div className="width-default-content">
                    <MainTitle fontSizeResponisve="30px">
                      ¿Cómo funciona Wateke?
                    </MainTitle>
                    <Description
                      colorText="#979ca8"
                      textAlign="left"
                      fontSize="15px"
                    >
                      Puedes crear tu propio Spot para eventos o uso personal.
                    </Description>
                    <div className="divider margin-top-20" />
                  </div>
                </div>
                <div className="total-center">
                  <CardOnBoarding
                    title="Crea tu propio Spot"
                    description="Invita a tus amigos a postular la música de sus artistas favoritos, diferentes ritmos o las canciones nuevas que 
                                            deseen escuchar en tu evento especial."
                  />
                </div>
              </DarkPaper>
            </div>
            <div>
              <DarkPaper>
                <div className="total-center">
                  <div className="width-default-content">
                    <MainTitle fontSizeResponisve="30px">
                      ¿Cómo funciona Wateke?
                    </MainTitle>
                    <Description
                      colorText="#979ca8"
                      textAlign="left"
                      fontSize="15px"
                    >
                      El orden de reproducción lo tienen los usuarios.
                    </Description>
                    <div className="divider margin-top-20" />
                  </div>
                </div>
                <div className="total-center">
                  <CardOnBoarding
                    title="Interacción al máximo."
                    description="Olvídate de buscar las mejores canciones y deja que tus invitados creen un playlist divertido. Ahora serán ellos quienes
                                            propongan nuevos lanzamientos; sin embargo, sonará la pista que decida la mayoría a través de la interacción 
                                            e intercambio de reacciones."
                  />
                </div>
              </DarkPaper>
            </div>
          </Slider>
        </BoxSlider>
      </div>
      <div className="section-download-landing" id="items2">
        <img
          src="/assets/images/android.svg"
          alt="iphone-donwload"
          className="iphone-donwload"
        />
        <SectionDownload>
          <MainTitle
            textAlign="center"
            colorText="#FFF"
            fontSizeResponisve="30px"
          >
            Descarga la Aplicación.
          </MainTitle>
          <Description
            maxWidth="700px"
            fontSize="16px"
            fontSizeResponisve="12px"
          >
            La aplicación está disponible para dispositivos móviles Android e
            iOS. Conéctate a los Spots de tus lugares recurrentes y comparte la
            música de tus cantantes favoritos. Postula, reacciona y decide qué
            se va a reproducir. Todo esto mientras te diviertes con tus panas.
          </Description>
          <div className="box-btn-store">
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://itunes.apple.com/app/id1451630271"
            >
              <LogoStore
                src="/assets/images/app-store.svg"
                alt="app store"
                className="logo-store opacity"
              />
            </a>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://play.google.com/store/apps/details?id=com.wateke"
            >
              <LogoStore
                src="/assets/images/google-play.svg"
                alt="play store"
                className="logo-store opacity"
              />
            </a>
          </div>
          <MainTitle textAlign="center" colorText="#FFF" fontSize="30px">
            Prueba la versión web
          </MainTitle>
          <NavLink to="/login">
            <Buttom>REGISTRATE AHORA</Buttom>
          </NavLink>
        </SectionDownload>
        <img
          src="/assets/images/iphone.svg"
          alt="android-donwload"
          className="android-donwload"
        />
      </div>
      <div className="section-final" id="items3">
        <div className=" width-default-content">
          <MainTitle colorText="#9900fe" fontSizeResponisve="30px">
            ¿Donde puedes usar Wateke?
          </MainTitle>
          <Description maxWidth="700px" fontSize="16px" textAlign="left">
            <strong style={{ color: '#FFF' }}>Wateke</strong> fue creado para
            escuchar música en diversos escenarios. De esta manera, las personas
            interactúan a través del intercambio de canciones.
          </Description>
          <GridFinalLanding>
            <ItemsGrid className="items-section-4">
              <MainTitle fontSize="48px" textAlign="center" colorText="#FFF">
                Radio
              </MainTitle>
              <Description fontSize="18px">
                Wateke ofrece a todos los radioyentes la oportunidad de escuchar
                lo que desean. ¡Pruébalo en tu programa radial y haz que la
                audiencia y sintonía crezcan!.
              </Description>
            </ItemsGrid>
            <ItemsGrid className="items-section-4">
              <MainTitle
                fontSize="48px"
                textAlign="center"
                colorText="#FFF"
                className="title-items-section-4"
              >
                Gym
              </MainTitle>
              <Description fontSize="18px">
                Cardio, pesas y wateke ¡La combinación perfecta! Hidrátate con
                la mejor música mientras compartes tus hits preferidos.
              </Description>
            </ItemsGrid>
            <ItemsGrid className="items-section-4">
              <MainTitle
                fontSize="48px"
                textAlign="center"
                colorText="#FFF"
                className="title-items-section-4"
              >
                Oficinas
              </MainTitle>
              <Description fontSize="18px">
                Agrega y escucha tus pistas en el Spot de la oficina y sal de la
                rutina diaria.
              </Description>
            </ItemsGrid>

            <ItemsGrid className="items-section-4">
              <MainTitle
                fontSize="48px"
                textAlign="center"
                colorText="#FFF"
                className="title-items-section-4"
              >
                Fiestas
              </MainTitle>
              <Description fontSize="18px">
                ¡Ahora los invitados tienen el control! Wateke ofrece variedad e
                interacción.
              </Description>
            </ItemsGrid>
            <ItemsGrid className="items-section-4">
              <MainTitle
                fontSize="48px"
                textAlign="center"
                colorText="#FFF"
                className="title-items-section-4"
              >
                Restaurantes
              </MainTitle>
              <Description fontSize="18px">
                Que tus clientes sientan que interactúan en tu espacio.
              </Description>
            </ItemsGrid>
            <ItemsGrid className="items-section-4">
              <MainTitle
                fontSize="48px"
                textAlign="center"
                colorText="#FFF"
                className="title-items-section-4"
              >
                Conciertos
              </MainTitle>
              <Description fontSize="18px">
                Los breaks también se hicieron para disfrutar de la música.
                ¡Aprovéchalos! Consigue un spot y promociona canciones o
                artistas nuevos.
              </Description>
            </ItemsGrid>
          </GridFinalLanding>
          <Description
            maxWidth="1200px"
            textAlign="right"
            fontSize="29px"
            fontWeight="600"
            style={{ color: '#FFF', marginTop: 10 }}
          >
            Donde Quieras!
          </Description>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const GridMain = styled.div`
  width: 100%;
  max-width: 1366px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-auto-rows: auto;
  justify-items: center;
  align-items: start;
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    grid-row-gap: 40px;
    margin-top: 40px;
  }
`;
const LogoBanner = styled.img`
  width: auto;
  height: 100%;
  @media (max-width: 992px) {
    height: 300px;
  }
`;

const BoxSlider = styled.div`
  width: 100%;
  max-width: 90vw;
  height: 100%;
  min-height: 50vh;
  @media (max-width: 768px) {
    max-width: 95vw;
  }
`;
const DarkPaper = styled.div`
  width: 100%;
  max-width: 90vw;
  min-height: 80vh;
  box-shadow: 0 6px 9px 0 rgba(0, 0, 0, 0.16);
  background-color: #0d1419;
  display: grid;
  grid-template-rows: 150px 1fr;
  align-items: center;
  padding: 50px 20px 20px 20px;
  @media (max-width: 768px) {
    padding: 10px;
  }
  @media (max-width: 620px) {
    min-height: 95vh;
  }
`;
const MainTitle = styled.p`
  width: 100%;
  max-width: ${props => props.maxWidth};
  font-family: Poppins;
  font-size: ${props => props.fontSize || '60px'};
  font-weight: ${props => props.fontWeight || '600'};
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: ${props => props.textAlign || 'left'};
  color: ${props => props.colorText || '#00fece'};
  margin-top: ${props => props.marginTop};
  @media (max-width: 768px) {
    font-size: ${props => props.fontSizeResponisve};
    text-align: center;
  }
`;

const Buttom = styled.div`
  width: 100%;
  max-width: 350px;
  height: 50px;
  border-radius: 8px;
  background-color: #00fece;
  border: none;
  font-size: 15px;
  font-family: Poppins;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #0e161b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  :hover {
    opacity: 0.4;
    transition-duration: 0.3s;
    transition-timing-function: ease-out;
    user-select: none;
  }
  :active {
    opacity: 1 !important;
    color: #fff;
    background-color: #00fefe;
  }
`;

const SectionDownload = styled.div`
  display: grid;
  grid-template-rows: 1fr 100px 150px 100px;
  grid-auto-rows: 1fr;
  align-items: center;
  justify-items: center;
  width: 100%;
  @media (max-width: 620px) {
    grid-template-rows: 1fr;
    grid-gap: 30px;
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 50px;
  }
`;
const Description = styled.p`
  width: 100%;
  max-width: ${props => props.maxWidth};
  font-family: Poppins;
  font-size: ${props => props.fontSize || '14px'};
  font-weight: ${props => props.fontWeight || 'normal'};
  margin-top: ${props => props.marginTop};
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: ${props => props.textAlign || 'center'};
  color: ${props => props.colorText || '#979ca8'};
  @media (max-width: 768px) {
    font-size: ${props => props.fontSizeResponisve};
    text-align: ${props => props.textAlignResponisve};
  }
`;
const LogoStore = styled.img`
  width: 150px;
  height: auto;
`;

const GridFinalLanding = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-auto-rows: 200px;
  justify-items: center;
  align-items: center;
  margin-top: 50px;
`;
const ItemsGrid = styled.div`
  width: 100%;
  max-width: 310px;
  height: auto;
`;

export default LandingPage;
